import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isManager } from "@/lib/middleware";
import { createLog } from "@/lib/utils/logger";

export async function POST(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const { purchaseId } = await req.json();
        if (!purchaseId) return NextResponse.json({ success: false, message: "Purchase ID required" }, { status: 400 });

        // 1. Fetch purchase details
        const purchaseRes = await dbQuery(`
            SELECT p.*, pkg.name as package_name, pkg.duration_days, pkg.slug as package_slug,
                   u.email as user_email
            FROM purchases p
            JOIN packages pkg ON p.package_id = pkg.package_id
            JOIN users u ON p.user_id = u.user_id
            WHERE p.purchase_id = $1
        `, [purchaseId]);

        if (purchaseRes.rows.length === 0) return NextResponse.json({ success: false, message: "Purchase not found" }, { status: 404 });
        
        const purchase = purchaseRes.rows[0];
        if (purchase.status !== 'pending') return NextResponse.json({ success: false, message: "Purchase is already processed" }, { status: 400 });

        // 2. Check for existing subscription for this package (Renewal check)
        const existingSubRes = await dbQuery(`
            SELECT * FROM subscriptions 
            WHERE user_id = $1 AND package_id = $2 AND status NOT IN ('refunded', 'canceled')
            LIMIT 1
        `, [purchase.user_id, purchase.package_id]);

        let tenantId;
        let isRenewal = false;
        let subscriptionId;

        if (existingSubRes.rows.length > 0) {
            // RENEWAL LOGIC
            const existingSub = existingSubRes.rows[0];
            tenantId = existingSub.tenant_id;
            subscriptionId = existingSub.subscription_id;
            isRenewal = true;

            const durationDays = purchase.duration_days || 30;
            
            // Calculate new expiry: if already expired, start from NOW. If still active, stack it.
            await dbQuery(`
                UPDATE subscriptions 
                SET 
                    current_period_end = CASE 
                        WHEN current_period_end > NOW() THEN current_period_end + ($1 || ' days')::INTERVAL
                        ELSE NOW() + ($1 || ' days')::INTERVAL
                    END,
                    status = 'active',
                    purchase_id = $2,
                    updated_at = NOW()
                WHERE subscription_id = $3
            `, [String(durationDays), purchaseId, subscriptionId]);

        } else {
            // NEW SUBSCRIPTION LOGIC
            const tenantName = `${(purchase.user_email || '').split('@')[0]}-${purchase.package_slug || purchase.package_id}-${Date.now()}`;
            const tenantRes = await dbQuery(`
                INSERT INTO tenants (name, owner_id, status)
                VALUES ($1, $2, 'active')
                RETURNING *
            `, [tenantName, purchase.user_id]);
            tenantId = tenantRes.rows[0].tenant_id;

            const durationDays = purchase.duration_days || 30;
            await dbQuery(`
                INSERT INTO subscriptions (user_id, tenant_id, package_id, purchase_id, current_period_start, current_period_end, status)
                VALUES ($1, $2, $3, $4, NOW(), NOW() + ($5 || ' days')::INTERVAL, 'active')
            `, [purchase.user_id, tenantId, purchase.package_id, purchase.purchase_id, String(durationDays)]);
        }

        // 4. Update Purchase
        await dbQuery(`
            UPDATE purchases 
            SET status = 'approved', 
                tenant_id = $1, 
                approved_by = $2, 
                approved_at = NOW(),
                updated_at = NOW() 
            WHERE purchase_id = $3
        `, [tenantId, auth.data.id, purchaseId]);

        // 5. Update Payment
        await dbQuery(`
            UPDATE payments 
            SET status = 'success', 
                tenant_id = $1, 
                paid_at = NOW(),
                updated_at = NOW() 
            WHERE purchase_id = $2
        `, [tenantId, purchaseId]);

        // 6. Notify User
        await dbQuery(`
            INSERT INTO notifications (user_id, title, message, link)
            VALUES ($1, $2, $3, $4)
        `, [
            purchase.user_id,
            isRenewal ? 'Subscription Renewed!' : 'Service Activated!',
            isRenewal 
                ? `Your subscription for "${purchase.package_name}" has been extended. Thank you for staying with us!`
                : `Your purchase for "${purchase.package_name}" has been approved. You can now access your service.`,
            '/dashboard/user/purchases'
        ]);

        // 7. Activity Log
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
            data: { tenantId }
        });

    } catch (error) {
        console.error('Confirmation Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
