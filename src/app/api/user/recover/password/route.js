import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbQuery } from '@/lib/database/pg';

export async function PATCH(req) {
    try {
        const { email, otp, new_password } = await req.json();

        const res = await dbQuery(`
            SELECT user_id FROM users 
            WHERE email = $1 AND reset_token = $2 AND token_expires_at > NOW()
        `, [email, otp]);

        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Invalid or expired OTP" }, { status: 400 });
        }

        const userId = res.rows[0].user_id;
        const hashedPassword = await bcrypt.hash(new_password, 10);

        await dbQuery(`
            UPDATE users 
            SET password = $1, reset_token = NULL, token_expires_at = NULL, updated_at = NOW()
            WHERE user_id = $2
        `, [hashedPassword, userId]);

        return NextResponse.json({ success: true, message: "Password updated successfully. Please login." });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
