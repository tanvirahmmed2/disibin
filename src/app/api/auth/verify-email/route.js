import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get('token');
        const email = searchParams.get('email');

        if (!token || !email) {
            return NextResponse.json({ success: false, message: 'Invalid token or email' }, { status: 400 });
        }

        const res = await dbQuery(`
            SELECT user_id, token_expires_at FROM users 
            WHERE email = $1 AND reset_token = $2
        `, [email, token]);

        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 400 });
        }

        const user = res.rows[0];
        if (new Date() > new Date(user.token_expires_at)) {
            return NextResponse.json({ success: false, message: 'Token has expired' }, { status: 400 });
        }

        // Verify user
        await dbQuery(`
            UPDATE users 
            SET is_verified = true, reset_token = NULL, token_expires_at = NULL 
            WHERE user_id = $1
        `, [user.user_id]);

        return NextResponse.redirect(new URL('/login?verified=true', req.url));

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
