import { NextResponse } from "next/server";
import { isLogin } from "@/lib/middleware";
import { dbQuery } from "@/lib/database/pg";

export async function GET(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        let query = `
            SELECT p.*, u.name as user_name, u.email as user_email
            FROM payments p
            LEFT JOIN users u ON p.user_id = u.user_id
        `;

        let params = [];
        if (auth.data.role !== 'manager' && auth.data.role !== 'admin') {
            query += ` WHERE p.user_id = $1`;
            params.push(auth.data.id);
        }

        query += ` ORDER BY p.created_at DESC`;
        
        const res = await dbQuery(query, params);
        
        return NextResponse.json({ success: true, data: res.rows });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
