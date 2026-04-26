import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isManager } from "@/lib/middleware";

export async function GET(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        // Fetch all tenants with owner information
        const res = await dbQuery(`
            SELECT 
                t.*, 
                u.name as owner_name, u.email as owner_email
            FROM tenants t
            LEFT JOIN users u ON t.owner_id = u.user_id
            ORDER BY t.created_at DESC
        `);

        return NextResponse.json({ 
            success: true, 
            message: 'Tenants fetched', 
            data: res.rows 
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
