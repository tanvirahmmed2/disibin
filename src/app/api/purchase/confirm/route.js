import { NextResponse } from "next/server";
import { dbQuery, transaction } from "@/lib/database/pg";
import { isManager } from "@/lib/middleware";
import { createLog } from "@/lib/utils/logger";

export async function POST(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const { purchaseId } = await req.json();
        if (!purchaseId) return NextResponse.json({ success: false, message: "Purchase ID required" }, { status: 400 });

        const purchaseRes = await dbQuery(`
            SELECT p.*, pkg.name as package_name, pkg.duration_days, pkg.slug as package_slug,
                   u.email as user_email, u.name as user_name
            FROM purchases p
            JOIN packages pkg ON p.package_id = pkg.package_id
            JOIN users u ON p.user_id = u.user_id
            WHERE p.purchase_id = $1
        `, [purchaseId]);

        if (purchaseRes.rows.length === 0) return NextResponse.json({ success: false, message: "Purchase not found" }, { status: 404 });
        
        const purchase = purchaseRes.rows[0];
        if (purchase.status !== 'pending') return NextResponse.json({ success: false, message: "Purchase is already processed" }, { status: 400 });

        // 2. Fetch the pending subscription to get the "frozen" duration data
        const pendingSubRes = await dbQuery(`
            SELECT * FROM subscriptions WHERE purchase_id = $1 AND status = 'pending'
        `, [purchaseId]);
        
        if (pendingSubRes.rows.length === 0) return NextResponse.json({ success: false, message: "Pending subscription record not found" }, { status: 404 });
        const pendingSub = pendingSubRes.rows[0];
        
        // Calculate duration days from the pending record
        const durationDays = Math.ceil((new Date(pendingSub.current_period_end) - new Date(pendingSub.current_period_start)) / (1000 * 60 * 60 * 24)) || 30;

        // 3. Check for existing ACTIVE/EXPIRED subscription (to extend)
        // If purchase is already linked to a tenant (renewal), prioritize that tenant.
        let existingSubRes;
        if (purchase.tenant_id) {
            existingSubRes = await dbQuery(`
                SELECT * FROM subscriptions 
                WHERE user_id = $1 AND tenant_id = $2 AND package_id = $3 AND status NOT IN ('refunded', 'canceled', 'pending')
                LIMIT 1
            `, [purchase.user_id, purchase.tenant_id, purchase.package_id]);
        } else {
            existingSubRes = await dbQuery(`
                SELECT * FROM subscriptions 
                WHERE user_id = $1 AND package_id = $2 AND status NOT IN ('refunded', 'canceled', 'pending')
                LIMIT 1
            `, [purchase.user_id, purchase.package_id]);
        }

        const result = await transaction(async (client) => {
            let tenantId;
            let isRenewal = false;

            if (existingSubRes.rows.length > 0) {
                // RENEWAL/EXTENSION LOGIC (Same Package)
                const existingSub = existingSubRes.rows[0];
                tenantId = existingSub.tenant_id;
                isRenewal = true;
                
                await client.query(`
                    UPDATE subscriptions 
                    SET 
                        current_period_start = CASE 
                            WHEN current_period_end > NOW() THEN current_period_start 
                            ELSE NOW() 
                        END,
                        current_period_end = CASE 
                            WHEN current_period_end > NOW() THEN current_period_end + ($1 || ' days')::INTERVAL
                            ELSE NOW() + ($1 || ' days')::INTERVAL
                        END,
                        status = 'active',
                        purchase_id = $2,
                        updated_at = NOW()
                    WHERE subscription_id = $3
                `, [String(durationDays), purchaseId, existingSub.subscription_id]);

                await client.query("DELETE FROM subscriptions WHERE subscription_id = $1", [pendingSub.subscription_id]);
                await client.query("UPDATE tenants SET status = 'active', updated_at = NOW() WHERE tenant_id = $1", [tenantId]);
                await client.query("UPDATE websites SET status = 'active', updated_at = NOW() WHERE tenant_id = $1 AND status = 'suspended'", [tenantId]);

            } else if (purchase.tenant_id) {
                // RE-PURCHASE/UPGRADE LOGIC (Different Package, Existing Tenant)
                tenantId = purchase.tenant_id;
                isRenewal = true; // Still counts as renewal of service

                // Activate the pending subscription for the existing tenant
                await client.query(`
                    UPDATE subscriptions 
                    SET 
                        tenant_id = $1, 
                        status = 'active', 
                        current_period_start = NOW(),
                        current_period_end = NOW() + ($3 || ' days')::INTERVAL,
                        updated_at = NOW()
                    WHERE subscription_id = $2
                `, [tenantId, pendingSub.subscription_id, String(durationDays)]);

                await client.query("UPDATE tenants SET status = 'active', updated_at = NOW() WHERE tenant_id = $1", [tenantId]);
                await client.query("UPDATE websites SET status = 'active', updated_at = NOW() WHERE tenant_id = $1 AND status = 'suspended'", [tenantId]);

            } else {
                // NEW TENANT & SUBSCRIPTION LOGIC
                const tenantName = purchase.user_name || (purchase.user_email || '').split('@')[0];
                const tenantRes = await client.query(`
                    INSERT INTO tenants (name, owner_id, status)
                    VALUES ($1, $2, 'active')
                    RETURNING *
                `, [tenantName, purchase.user_id]);
                tenantId = tenantRes.rows[0].tenant_id;

                await client.query(`
                    UPDATE subscriptions 
                    SET 
                        tenant_id = $1, 
                        status = 'active', 
                        current_period_start = NOW(),
                        current_period_end = NOW() + ($3 || ' days')::INTERVAL,
                        updated_at = NOW()
                    WHERE subscription_id = $2
                `, [tenantId, pendingSub.subscription_id, String(durationDays)]);

                await client.query(`
                    INSERT INTO tenant_users (tenant_id, user_id, role)
                    VALUES ($1, $2, 'owner')
                    ON CONFLICT (tenant_id, user_id) DO NOTHING
                `, [tenantId, purchase.user_id]);

                await client.query(`
                    INSERT INTO websites (tenant_id, name, status)
                    VALUES ($1, $2, 'development')
                `, [tenantId, `${purchase.package_name} - ${tenantName}`]);
            }

            // 4. Update Purchase
            await client.query(`
                UPDATE purchases 
                SET status = 'approved', 
                    tenant_id = $1, 
                    approved_by = $2, 
                    approved_at = NOW(),
                    updated_at = NOW() 
                WHERE purchase_id = $3
            `, [tenantId, auth.data.id, purchaseId]);

            // 5. Update Payment
            await client.query(`
                UPDATE payments 
                SET status = 'success', 
                    tenant_id = $1, 
                    paid_at = NOW(),
                    updated_at = NOW() 
                WHERE purchase_id = $2
            `, [tenantId, purchaseId]);

            // 6. Notify User
            await client.query(`
                INSERT INTO notifications (user_id, title, message, link)
                VALUES ($1, $2, $3, $4)
            `, [
                purchase.user_id,
                isRenewal ? 'Subscription Renewed!' : 'Service Activated!',
                isRenewal 
                    ? `Your subscription for "${purchase.package_name}" has been extended. Thank you for staying with us!`
                    : `Your purchase for "${purchase.package_name}" has been approved. You can now access your service.`,
                '/dashboard/user/subscription'
            ]);

            return { tenantId, isRenewal };
        });

        // 7. Activity Log (outside transaction)
        await createLog({
            userId: auth.data.id,
            action: 'approve',
            targetType: 'purchase',
            targetId: purchaseId,
            description: `Approved purchase #${purchaseId} for user ${purchase.user_email}`
        });

        return NextResponse.json({
            success: true,
            message: "Purchase approved and service activated successfully",
            data: { tenantId: result.tenantId }
        });

    } catch (error) {
        console.error('Confirmation Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
