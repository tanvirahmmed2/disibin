import { pool } from "@/lib/database/pg";
import { isLogin } from "@/lib/middleware";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        const query = `
            SELECT * FROM public.supports 
            WHERE email = $1 
            ORDER BY created_at DESC
        `;
        const result = await pool.query(query, [auth.payload.email]);

        return NextResponse.json({
            success: true,
            payload: result.rows
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}