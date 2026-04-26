import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isLogin } from "@/lib/middleware";

export async function GET(req, { params }) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        const user = auth.data;

        const { id } = await params;

        let sql = `
            SELECT 
                sub.*, 
                pkg.name as package_name, pkg.description as package_description, pkg.duration_days, pkg.is_lifetime as package_lifetime,
                t.name as tenant_name, t.domain as tenant_domain, t.status as tenant_status,
                p.final_amount, p.created_at as purchase_date,
                pay.transaction_id, pay.method as payment_method, pay.status as payment_status
            FROM subscriptions sub
            LEFT JOIN packages pkg ON sub.package_id = pkg.package_id
            LEFT JOIN tenants t ON sub.tenant_id = t.tenant_id
            LEFT JOIN purchases p ON sub.purchase_id = p.purchase_id
            LEFT JOIN payments pay ON p.purchase_id = pay.purchase_id
            WHERE sub.subscription_id = $1
        `;

        const res = await dbQuery(sql, [id]);
        if (res.rows.length === 0) return NextResponse.json({ success: false, message: "Subscription not found" }, { status: 404 });

        const subscription = res.rows[0];

        // Access Control: Only admin/manager or the owner can view this
        if (user.role !== 'admin' && user.role !== 'manager' && subscription.user_id !== user.id) {
            return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 403 });
        }

        // Fetch features
        let features = [];
        if (subscription.package_id) {
            const featRes = await dbQuery(`
                SELECT f.name, f.description, pf.value
                FROM package_features pf
                JOIN features f ON pf.feature_id = f.feature_id
                WHERE pf.package_id = $1
            `, [subscription.package_id]);
            features = featRes.rows;
        }
        
        return NextResponse.json({ 
            success: true, 
            message: 'Subscription details fetched', 
            data: { ...subscription, features } 
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
