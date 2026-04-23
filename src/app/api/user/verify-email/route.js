import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get('token');
        const email = searchParams.get('email');

        if (!token || !email) {
            return NextResponse.json({ success: false, message: 'Invalid verification link' }, { status: 400 });
        }

        const res = await dbQuery(`
            SELECT user_id FROM users 
            WHERE email = $1 AND reset_token = $2 AND token_expires_at > NOW()
        `, [email, token]);

        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: 'Invalid or expired verification link' }, { status: 400 });
        }

        const userId = res.rows[0].user_id;

        await dbQuery(`
            UPDATE users 
            SET is_verified = true, reset_token = NULL, token_expires_at = NULL, updated_at = NOW()
            WHERE user_id = $1
        `, [userId]);

        return NextResponse.json({
            success: true,
            message: 'Email verified successfully! You can now log in.'
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
