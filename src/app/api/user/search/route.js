import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isLogin } from "@/lib/middleware";

export async function GET(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        const adminUser = auth.data;

        // Only allow admin, manager, or support
        if (!['admin', 'manager', 'support'].includes(adminUser.role)) {
            return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ success: false, message: "Email parameter is required" }, { status: 400 });
        }

        // 1. Fetch User (excluding password)
        const userRes = await dbQuery(`
            SELECT user_id, name, email, phone, role, is_active, is_verified, 
                   city, country, address_line1, state, postal_code, created_at, last_login 
            FROM users 
            WHERE email = $1
        `, [email]);

        if (userRes.rows.length === 0) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const user = userRes.rows[0];
        const userId = user.user_id;

        // 2. Fetch Tickets
        const ticketsRes = await dbQuery(`
            SELECT ticket_id, subject, status, priority, created_at, updated_at 
            FROM tickets 
            WHERE user_id = $1 
            ORDER BY created_at DESC
        `, [userId]);

        // 3. Fetch Purchases & Payments
        const purchasesRes = await dbQuery(`
            SELECT p.purchase_id, p.final_amount, p.status as purchase_status, p.created_at, 
                   pkg.name as package_name, pay.transaction_id, pay.status as payment_status
            FROM purchases p
            LEFT JOIN packages pkg ON p.package_id = pkg.package_id
            LEFT JOIN payments pay ON p.purchase_id = pay.purchase_id
            WHERE p.user_id = $1
            ORDER BY p.created_at DESC
        `, [userId]);

        // 4. Fetch Subscriptions
        const subsRes = await dbQuery(`
            SELECT s.subscription_id, s.status, s.current_period_start, s.current_period_end, s.created_at,
                   pkg.name as package_name, t.name as tenant_name, t.domain
            FROM subscriptions s
            LEFT JOIN packages pkg ON s.package_id = pkg.package_id
            LEFT JOIN tenants t ON s.tenant_id = t.tenant_id
            WHERE s.user_id = $1
            ORDER BY s.created_at DESC
        `, [userId]);

        // 5. Fetch Tenants (Workspaces)
        const tenantsRes = await dbQuery(`
            SELECT tenant_id, name, domain, status, created_at 
            FROM tenants 
            WHERE owner_id = $1
            ORDER BY created_at DESC
        `, [userId]);

        return NextResponse.json({
            success: true,
            message: "User data fetched successfully",
            data: {
                profile: user,
                tickets: ticketsRes.rows,
                purchases: purchasesRes.rows,
                subscriptions: subsRes.rows,
                tenants: tenantsRes.rows
            }
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
