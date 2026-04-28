import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isLogin, isManager } from "@/lib/middleware";

// GET /api/website — list all websites for the current user
export async function GET(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        const user = auth.data;

        // List all websites for the user
        const res = await dbQuery(`
            SELECT w.*, t.name as tenant_name
            FROM websites w
            JOIN tenant_users tu ON w.tenant_id = tu.tenant_id
            JOIN tenants t ON w.tenant_id = t.tenant_id
            WHERE tu.user_id = $1
        `, [user.id]);
        
        return NextResponse.json({ success: true, data: res.rows });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST /api/website — create a new website for a tenant
export async function POST(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const { tenant_id, name, domain, status } = await req.json();

        if (!tenant_id) {
            return NextResponse.json({ success: false, message: "tenant_id is required" }, { status: 400 });
        }

        const res = await dbQuery(`
            INSERT INTO websites (tenant_id, name, domain, status)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `, [tenant_id, name || null, domain || null, status || 'development']);

        return NextResponse.json({ success: true, message: 'Website created', data: res.rows[0] });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE /api/website — delete a website
export async function DELETE(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const { id } = await req.json();

        const res = await dbQuery("DELETE FROM websites WHERE website_id = $1 RETURNING *", [id]);
        if (res.rows.length === 0) return NextResponse.json({ success: false, message: "Website not found" }, { status: 404 });

        return NextResponse.json({ success: true, message: 'Website deleted' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
