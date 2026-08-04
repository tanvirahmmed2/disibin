import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { dbQuery } from "@/lib/database/pg";
import { sendEmail } from "@/lib/database/brevo";
import { BASE_URL } from "@/lib/database/secret";

// POST — Request password reset email
export async function POST(req) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
        }

        const res = await dbQuery("SELECT id, name FROM users WHERE email = $1", [email]);
        const user = res.rows[0];

        // Always return success for security (don't reveal if email exists)
        if (!user) {
            return NextResponse.json({
                success: true,
                message: "If an account exists with this email, you will receive a password reset link."
            });
        }

        // Generate reset token (1 hour expiry)
        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 3600000);

        await dbQuery(
            `UPDATE users SET reset_token = $1, token_expires_at = $2 WHERE email = $3`,
            [token, expiresAt, email]
        );

        const resetLink = `${BASE_URL}/auth/recovery?token=${token}`;
        const htmlContent = `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 10px;">
                <h1 style="color: #0f172a; font-size: 24px; font-weight: 700; margin-bottom: 16px;">Password Reset Request</h1>
                <p style="color: #64748b; line-height: 1.6; margin-bottom: 24px;">Hi ${user.name}, you requested to reset your password for your Disibin account. Click the button below to set a new password:</p>
                <a href="${resetLink}" style="display: inline-block; padding: 16px 32px; background-color: #0ea5e9; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 600;">Reset Password</a>
                <p style="color: #94a3b8; font-size: 12px; margin-top: 32px;">This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
            </div>
        `;

        await sendEmail({ to: email, subject: "Password Reset - Disibin", htmlContent });

        return NextResponse.json({
            success: true,
            message: "If an account exists with this email, you will receive a password reset link."
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PATCH — Reset password with token
export async function PATCH(req) {
    try {
        const { token, newPassword } = await req.json();

        if (!token || !newPassword) {
            return NextResponse.json(
                { success: false, message: "Reset token and new password are required" },
                { status: 400 }
            );
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { success: false, message: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        const res = await dbQuery(
            `SELECT id, email FROM users WHERE reset_token = $1 AND token_expires_at > now()`,
            [token]
        );
        const user = res.rows[0];

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Invalid or expired password reset token" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await dbQuery(
            `UPDATE users SET password = $1, reset_token = NULL, token_expires_at = NULL, updated_at = now() WHERE id = $2`,
            [hashedPassword, user.id]
        );

        return NextResponse.json({
            success: true,
            message: "Password reset successfully. You can now login with your new password."
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
