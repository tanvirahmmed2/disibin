import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isManager } from "@/lib/middleware";

export async function GET(req, { params }) {
    try {
        const auth = await isManager();
        if (!auth.success) {
            return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
        }

        const userId = params.id;
        if (!userId) {
            return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
        }

        // Fetch user basic info
        const userRes = await dbQuery("SELECT user_id, name, email, phone, role, is_active, city, country, address_line1, address_line2, state, postal_code, created_at FROM users WHERE user_id = $1", [userId]);
        if (userRes.rows.length === 0) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }
        const user = userRes.rows[0];

        // Fetch purchases
        const purchasesRes = await dbQuery(`
            SELECT p.*, pkg.name as package_name 
            FROM purchases p
            LEFT JOIN packages pkg ON p.package_id = pkg.package_id
            WHERE p.user_id = $1
            ORDER BY p.created_at DESC
        `, [userId]);

        // Fetch subscriptions
        const subsRes = await dbQuery(`
            SELECT s.*, pkg.name as package_name, t.name as tenant_name, t.domain
            FROM subscriptions s
            LEFT JOIN packages pkg ON s.package_id = pkg.package_id
            LEFT JOIN tenants t ON s.tenant_id = t.tenant_id
            WHERE s.user_id = $1
            ORDER BY s.created_at DESC
        `, [userId]);

        user.purchases = purchasesRes.rows;
        user.subscriptions = subsRes.rows;

        return NextResponse.json({
            success: true,
            message: 'User details fetched',
            data: user
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
