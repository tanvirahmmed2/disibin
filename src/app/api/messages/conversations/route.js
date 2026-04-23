import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isLogin } from "@/lib/middleware";

export async function GET(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const currentUser = auth.data;

        // Fetch all management staff across the entire system
        const res = await dbQuery(`
            SELECT user_id, name, email, role, is_active
            FROM users
            WHERE role IN ('admin', 'manager', 'support', 'developer')
              AND user_id != $1
            ORDER BY name ASC
        `, [currentUser.id]);

        return NextResponse.json({ 
            success: true, 
            message: 'Conversations fetched', 
            data: res.rows.map(row => ({ ...row, _id: row.user_id, isActive: row.is_active })) 
        });
    } catch (error) {
        console.error("GET Conversations Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
