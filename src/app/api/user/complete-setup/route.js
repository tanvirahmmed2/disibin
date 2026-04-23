import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const { token, email, password, name, phone } = await req.json();

        if (!token || !email || !password || !name || !phone) {
            return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
        }

        const res = await dbQuery(`
            SELECT user_id FROM users 
            WHERE email = $1 AND reset_token = $2 AND token_expires_at > NOW()
        `, [email, token]);

        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: 'Invalid or expired setup link' }, { status: 400 });
        }

        const userId = res.rows[0].user_id;
        const hashedPassword = await bcrypt.hash(password, 10);

        await dbQuery(`
            UPDATE users 
            SET name = $1, phone = $2, password = $3, is_verified = true, reset_token = NULL, token_expires_at = NULL, updated_at = NOW()
            WHERE user_id = $4
        `, [name, phone, hashedPassword, userId]);

        return NextResponse.json({
            success: true,
            message: 'Account setup successfully! You can now log in.'
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
