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
                p.*, 
                u.name as user_name, u.email as user_email, u.phone as user_phone,
                pkg.name as package_name, pkg.description as package_description, pkg.duration_days, pkg.is_lifetime as package_lifetime,
                pay.transaction_id, pay.method as payment_method, pay.paid_at, pay.status as payment_status,
                sub.status as subscription_status, sub.current_period_start, sub.current_period_end, sub.subscription_id,
                t.name as tenant_name, t.domain as tenant_domain, t.status as tenant_status, t.tenant_id
            FROM purchases p
            JOIN users u ON p.user_id = u.user_id
            LEFT JOIN packages pkg ON p.package_id = pkg.package_id
            LEFT JOIN payments pay ON p.purchase_id = pay.purchase_id
            LEFT JOIN subscriptions sub ON p.purchase_id = sub.purchase_id
            LEFT JOIN tenants t ON p.tenant_id = t.tenant_id OR sub.tenant_id = t.tenant_id
            WHERE p.purchase_id = $1
        `;

        const res = await dbQuery(sql, [id]);
        if (res.rows.length === 0) return NextResponse.json({ success: false, message: "Purchase not found" }, { status: 404 });

        const purchase = res.rows[0];

        // Access Control: Only admin/manager or the owner can view this
        if (user.role !== 'admin' && user.role !== 'manager' && purchase.user_id !== user.id) {
            return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 403 });
        }

        // We should also fetch the features for the package to show entitlements
        let features = [];
        if (purchase.package_id) {
            const featRes = await dbQuery(`
                SELECT f.name, f.description, pf.value
                FROM package_features pf
                JOIN features f ON pf.feature_id = f.feature_id
                WHERE pf.package_id = $1
            `, [purchase.package_id]);
            features = featRes.rows;
        }
        
        return NextResponse.json({ 
            success: true, 
            message: 'Purchase details fetched', 
            data: { ...purchase, features, id: purchase.purchase_id, _id: purchase.purchase_id } 
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const { id } = await params;

        // Verify status is refunded before deleting
        const checkRes = await dbQuery("SELECT status FROM purchases WHERE purchase_id = $1", [id]);
        if (checkRes.rows.length === 0) return NextResponse.json({ success: false, message: "Purchase not found" }, { status: 404 });
        
        if (checkRes.rows[0].status !== 'refunded') {
            return NextResponse.json({ success: false, message: "Only refunded purchases can be permanently deleted" }, { status: 400 });
        }

        await dbQuery("DELETE FROM purchases WHERE purchase_id = $1", [id]);
        return NextResponse.json({ success: true, message: "Purchase deleted permanently" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
