import { NextResponse } from 'next/server';
import connectDB from '@/lib/database/db';
import User from '@/lib/models/user';
import { sendEmail } from '@/lib/database/brevo';

export async function PUT(req) {
    try {
        await connectDB();
        const { email } = await req.json();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ success: false, message: "No account found with this email" }, { status: 404 });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.resetToken = otp;
        user.tokenExpiresAt = expires;
        await user.save();

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