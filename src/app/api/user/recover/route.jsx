import { NextResponse } from 'next/server';
import { pool } from '@/lib/database/pg';
import { sendEmail } from '@/lib/database/brevo';

export async function PUT(req) {
    try {
        const { email } = await req.json();

        const userResult = await pool.query('SELECT user_id, name FROM users WHERE email = $1', [email]);
        if (userResult.rowCount === 0) {
            return NextResponse.json({ message: "No account found with this email" }, { status: 404 });
        }

        const user = userResult.rows[0];

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 10 * 60 * 1000);

        await pool.query(
            'UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE email = $3',
            [otp, expires, email]
        );

        const emailRes = await sendEmail({
            toEmail: email,
            toName: user.name,
            subject: "Your Password Recovery Code",
            htmlContent: `<h3>Hello ${user.name},</h3>
                          <p>Your password recovery OTP is: <strong>${otp}</strong></p>
                          <p>This code expires in 10 minutes.</p>`
        });

        if (!emailRes.success) throw new Error("Email service failed");

        return NextResponse.json({ message: "OTP sent successfully to your email" });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}