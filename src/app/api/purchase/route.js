import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isLogin } from "@/lib/middleware";

export async function GET(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const user = auth.data;
        const { searchParams } = new URL(req.url);
        const personal = searchParams.get('personal');

        let sql;
        let params = [];
        if ((user.role === 'admin' || user.role === 'manager') && personal !== 'true') {
            sql = `
                SELECT p.*, pkg.name as package_name, pkg.slug as package_slug,
                       u.name as user_name, u.email as user_email
                FROM purchases p
                LEFT JOIN packages pkg ON p.package_id = pkg.package_id
                JOIN users u ON p.user_id = u.user_id
                ORDER BY p.created_at DESC
            `;
        } else {
            sql = `
                SELECT p.*, pkg.name as package_name, pkg.slug as package_slug 
                FROM purchases p
                LEFT JOIN packages pkg ON p.package_id = pkg.package_id
                WHERE p.user_id = $1 
                ORDER BY p.created_at DESC
            `;
            params = [user.id];
        }
        const res = await dbQuery(sql, params);
        return NextResponse.json({ 
            success: true, 
            message: 'Purchases fetched', 
            data: res.rows 
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const body = await req.json();
        const { package_id, amount } = body;

        if (!package_id || !amount) {
            return NextResponse.json({ success: false, message: "Package ID and amount are required" }, { status: 400 });
        }

        const res = await dbQuery(`
            INSERT INTO purchases (user_id, package_id, amount, status)
            VALUES ($1, $2, $3, 'pending')
            RETURNING *
        `, [auth.data.id, package_id, amount]);

        const purchase = res.rows[0];

        // Log sensitive action
        await dbQuery(`
            INSERT INTO logs (user_id, action, entity_type, entity_id, description)
            VALUES ($1, $2, $3, $4, $5)
        `, [auth.data.id, 'create', 'purchase', purchase.purchase_id, `New purchase initiated for package ${package_id}`]);

        return NextResponse.json({ 
            success: true, 
            message: 'Purchase created successfully', 
            data: purchase 
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
