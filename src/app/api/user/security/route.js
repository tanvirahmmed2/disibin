import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { isUserLogin } from "@/lib/auth/user";
import { dbQuery } from "@/lib/database/pg";
import { sendEmail } from "@/lib/database/brevo";

export async function POST(req) {
    try {
        const auth = await isUserLogin();
        if (!auth.success) {
            return NextResponse.json(auth, { status: 401 });
        }

        const userId = auth.data.id;
        const body = await req.json();
        const { action } = body;

        // 0. TOGGLE 2FA
        if (action === 'toggle-2fa') {
            const { is2faActive } = body;
            await dbQuery(
                "UPDATE users SET is_2fa_active = $1, updated_at = now() WHERE id = $2",
                [!!is2faActive, userId]
            );
            return NextResponse.json({
                success: true,
                message: `Two-Factor Authentication has been ${is2faActive ? 'enabled' : 'disabled'}.`,
                is2faActive: !!is2faActive
            });
        }

        // 1. CHANGE PASSWORD
        if (action === 'change-password') {
            const { currentPassword, newPassword } = body;
            if (!currentPassword || !newPassword) {
                return NextResponse.json({ success: false, message: "Current and new password are required" }, { status: 400 });
            }

            if (newPassword.length < 6) {
                return NextResponse.json({ success: false, message: "New password must be at least 6 characters" }, { status: 400 });
            }

            const userRes = await dbQuery("SELECT password FROM users WHERE id = $1", [userId]);
            if (userRes.rows.length === 0) {
                return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
            }

            const isMatch = await bcrypt.compare(currentPassword, userRes.rows[0].password);
            if (!isMatch) {
                return NextResponse.json({ success: false, message: "Current password is incorrect" }, { status: 400 });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await dbQuery("UPDATE users SET password = $1, updated_at = now() WHERE id = $2", [hashedPassword, userId]);

            return NextResponse.json({ success: true, message: "Password updated successfully" });
        }

        // 2. REQUEST EMAIL CHANGE (Sends verification code to current/old email)
        if (action === 'request-email-change') {
            const { newEmail } = body;
            if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
                return NextResponse.json({ success: false, message: "A valid new email address is required" }, { status: 400 });
            }

            const currentUserRes = await dbQuery("SELECT email, name FROM users WHERE id = $1", [userId]);
            if (currentUserRes.rows.length === 0) {
                return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
            }

            const currentEmail = currentUserRes.rows[0].email;
            const userName = currentUserRes.rows[0].name;

            if (newEmail.toLowerCase() === currentEmail.toLowerCase()) {
                return NextResponse.json({ success: false, message: "New email must be different from current email" }, { status: 400 });
            }

            // Check if new email is already taken
            const existingUser = await dbQuery("SELECT id FROM users WHERE email = $1", [newEmail]);
            if (existingUser.rows.length > 0) {
                return NextResponse.json({ success: false, message: "This email address is already in use by another user account" }, { status: 400 });
            }

            const existingTeam = await dbQuery("SELECT id FROM teams WHERE email = $1", [newEmail]);
            if (existingTeam.rows.length > 0) {
                return NextResponse.json({ success: false, message: "This email address is already in use by a team account" }, { status: 400 });
            }

            // Generate 6-digit verification code & 15-min expiration
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

            await dbQuery(
                `UPDATE users 
                 SET pending_email = $1, email_change_code = $2, email_change_expires_at = $3, updated_at = now() 
                 WHERE id = $4`,
                [newEmail, verificationCode, expiresAt, userId]
            );

            // Send Brevo email to OLD/CURRENT registered email address
            const htmlContent = `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 12px; background: #ffffff;">
                    <h1 style="color: #0f172a; font-size: 22px; font-weight: 700; margin-bottom: 12px;">Email Change Verification Code</h1>
                    <p style="color: #475569; font-size: 14px; line-height: 1.6;">Hello ${userName},</p>
                    <p style="color: #475569; font-size: 14px; line-height: 1.6;">A request was received to update your email address to <strong>${newEmail}</strong>.</p>
                    <p style="color: #475569; font-size: 14px; line-height: 1.6;">Please use the following 6-digit verification code to confirm this change:</p>
                    <div style="margin: 24px 0; padding: 18px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; text-align: center;">
                        <span style="font-family: monospace; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #0ea5e9;">${verificationCode}</span>
                    </div>
                    <p style="color: #94a3b8; font-size: 12px; line-height: 1.5;">This code will expire in 15 minutes. If you did not request this email change, please secure your account password immediately.</p>
                </div>
            `;

            await sendEmail({
                to: currentEmail,
                subject: "Email Change Verification Code - Disibin",
                htmlContent
            });

            return NextResponse.json({
                success: true,
                message: `Verification code sent to your current email (${currentEmail}). Please enter the code to confirm.`,
                pendingEmail: newEmail
            });
        }

        // 3. VERIFY EMAIL CHANGE (Verifies 6-digit code)
        if (action === 'verify-email-change') {
            const { code } = body;
            if (!code) {
                return NextResponse.json({ success: false, message: "Verification code is required" }, { status: 400 });
            }

            const userRes = await dbQuery(
                `SELECT pending_email, email_change_code, email_change_expires_at 
                 FROM users WHERE id = $1`,
                [userId]
            );

            if (userRes.rows.length === 0) {
                return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
            }

            const { pending_email, email_change_code, email_change_expires_at } = userRes.rows[0];

            if (!pending_email || !email_change_code) {
                return NextResponse.json({ success: false, message: "No email change request pending" }, { status: 400 });
            }

            if (new Date() > new Date(email_change_expires_at)) {
                return NextResponse.json({ success: false, message: "Verification code has expired. Please request a new code." }, { status: 400 });
            }

            if (email_change_code.trim() !== code.trim()) {
                return NextResponse.json({ success: false, message: "Invalid verification code" }, { status: 400 });
            }

            // Code verified! Update email and clear pending fields
            await dbQuery(
                `UPDATE users 
                 SET email = $1, pending_email = NULL, email_change_code = NULL, email_change_expires_at = NULL, updated_at = now() 
                 WHERE id = $2`,
                [pending_email, userId]
            );

            return NextResponse.json({
                success: true,
                message: "Email address updated successfully!",
                newEmail: pending_email
            });
        }

        return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
