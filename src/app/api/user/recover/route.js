import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/database/pg';
import { sendEmail } from '@/lib/database/brevo';

export async function PUT(req) {
    try {
        const { email } = await req.json();

        const res = await dbQuery("SELECT user_id, name, email FROM users WHERE email = $1", [email]);
        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: "No account found with this email" }, { status: 404 });
        }
        const user = res.rows[0];

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 10 * 60 * 1000); 

        await dbQuery(`
            UPDATE users SET reset_token = $1, token_expires_at = $2, updated_at = NOW() 
            WHERE user_id = $3
        `, [otp, expires, user.user_id]);

        const emailRes = await sendEmail({
            toEmail: email,
            toName: user.name,
            subject: "Your Password Recovery Code",
            htmlContent: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Password Recovery</h2>
                    <p>Hi ${user.name},</p>
                    <p>Your password recovery OTP is: <strong style="font-size: 1.2rem; color: #059669;">${otp}</strong></p>
                    <p>This code expires in 10 minutes.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                </div>
            `
        });

        if (!emailRes.success) throw new Error("Email service failed");

        return NextResponse.json({ success: true, message: "OTP sent successfully to your email" });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
