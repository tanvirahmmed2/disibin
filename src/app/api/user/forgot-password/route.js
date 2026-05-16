import { NextResponse } from "next/server";
import crypto from "crypto";
import { getUserByEmail, setUserResetToken } from "@/lib/data/users";
import { sendEmail } from "@/lib/utils/brevo";
import { BASE_URL } from "@/lib/database/secret";

export async function POST(req) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
        }

        const user = await getUserByEmail(email);
        if (!user) {
            // Return success even if user not found for security reasons
            return NextResponse.json({ 
                success: true, 
                message: "If an account exists with this email, you will receive a reset link." 
            });
        }

        // Generate reset token
        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 3600000); // 1 hour

        await setUserResetToken(email, token, expiresAt);

        // Send email
        const resetLink = `${BASE_URL}/reset-password?token=${token}`;
        const htmlContent = `
            <h1>Password Reset Request</h1>
            <p>You requested to reset your password. Click the link below to set a new one:</p>
            <a href="${resetLink}" style="padding: 10px 20px; background-color: #0ea5e9; color: white; text-decoration: none; rounded: 5px;">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, you can safely ignore this email.</p>
        `;

        const emailRes = await sendEmail({
            to: email,
            subject: "Password Reset - Disibin",
            htmlContent
        });

        if (!emailRes.success) {
            return NextResponse.json({ success: false, message: "Failed to send reset email" }, { status: 500 });
        }

        return NextResponse.json({ 
            success: true, 
            message: "If an account exists with this email, you will receive a reset link." 
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
