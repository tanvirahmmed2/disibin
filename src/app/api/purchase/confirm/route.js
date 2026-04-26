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

        // 2. Create Tenant
        const tenantName = `${(purchase.user_email || '').split('@')[0]}-${purchase.package_slug || purchase.package_id}-${Date.now()}`;
        const tenantRes = await dbQuery(`
            INSERT INTO tenants (name, owner_id, status)
            VALUES ($1, $2, 'active')
            RETURNING *
        `, [tenantName, purchase.user_id]);
        const tenantId = tenantRes.rows[0].tenant_id;

        // 3. Create Subscription
        const durationDays = purchase.duration_days; // Base duration
        await dbQuery(`
            INSERT INTO subscriptions (user_id, tenant_id, package_id, purchase_id, current_period_start, current_period_end, status)
            VALUES ($1, $2, $3, $4, NOW(), NOW() + ($5 || ' days')::INTERVAL, 'active')
        `, [purchase.user_id, tenantId, purchase.package_id, purchase.purchase_id, String(durationDays)]);

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
            'Service Activated!',
            `Your purchase for "${purchase.package_name}" has been approved. You can now access your service.`,
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
