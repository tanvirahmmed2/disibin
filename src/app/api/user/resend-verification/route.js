import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/database/brevo";
import { BASE_URL } from "@/lib/database/secret";

export async function POST(req) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
        }

        const res = await dbQuery("SELECT user_id, name FROM users WHERE email = $1 AND is_verified = false", [email]);
        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: 'User not found or already verified' }, { status: 400 });
        }
        const user = res.rows[0];

        const verificationToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiresAt = new Date(Date.now() + 3600000); 

        await dbQuery(`
            UPDATE users SET reset_token = $1, token_expires_at = $2, updated_at = NOW() 
            WHERE user_id = $3
        `, [verificationToken, tokenExpiresAt, user.user_id]);

        const verificationUrl = `${BASE_URL}/api/auth/verify-email?token=${verificationToken}&email=${email}`;
        await sendVerificationEmail(email, user.name, verificationUrl);

        return NextResponse.json({
            success: true,
            message: 'Verification email resent successfully!'
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
