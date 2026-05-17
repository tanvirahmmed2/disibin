import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/middleware";
import { dbQuery } from "@/lib/database/pg";

export async function GET(req) {
    try {
        const auth = await isAdmin();
        if (!auth.success) {
            return NextResponse.json(auth, { status: 403 });
        }

        const res = await dbQuery(`
            SELECT l.log_id, l.user_id, l.action, l.entity_type, l.entity_id, l.description as details, l.created_at, u.name as user_name, u.role as user_role
            FROM logs l
            LEFT JOIN users u ON l.user_id = u.user_id
            ORDER BY l.created_at DESC
            LIMIT 500
        `);
        const logs = res.rows;

        return NextResponse.json({ success: true, data: logs });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
