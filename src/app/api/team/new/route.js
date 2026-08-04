import { isManager } from "@/lib/auth/team";
import { dbQuery } from "@/lib/database/pg";
import { sendEmail } from "@/lib/database/brevo";
import { BASE_URL, DEMO_PASSWORD } from "@/lib/database/secret";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(req) {
    try {
        const auth = await isManager();
        if (!auth.success) {
            return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
        }

        const { name, email, phone, role } = await req.json();

        if (!name || !email || !role) {
            return NextResponse.json(
                { success: false, message: "Name, email, and role are required" },
                { status: 400 }
            );
        }

        const validRoles = ['support', 'manager', 'developer'];
        if (!validRoles.includes(role)) {
            return NextResponse.json(
                { success: false, message: "Role must be support, manager, or developer" },
                { status: 400 }
            );
        }

        // Check email uniqueness
        const emailRes = await dbQuery("SELECT id FROM teams WHERE email = $1", [email]);
        if (emailRes.rows.length > 0) {
            return NextResponse.json({ success: false, message: "Email already registered" }, { status: 400 });
        }

        // Check phone uniqueness (if provided)
        if (phone) {
            const phoneRes = await dbQuery("SELECT id FROM teams WHERE phone = $1", [phone]);
            if (phoneRes.rows.length > 0) {
                return NextResponse.json({ success: false, message: "Phone number already registered" }, { status: 400 });
            }
        }

        // Use DEMO_PASSWORD as the default temp password
        const tempPassword = DEMO_PASSWORD || crypto.randomBytes(8).toString("hex");
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        // Generate verification token (7-day expiry)
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const verificationExpiresAt = new Date(Date.now() + 7 * 24 * 3600000);

        const insertRes = await dbQuery(
            `INSERT INTO teams (name, email, phone, password, role, verification_token, verification_expires_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id, name, email, phone, role, is_active, is_verified, created_at`,
            [name, email, phone || null, hashedPassword, role, verificationToken, verificationExpiresAt]
        );
        const newMember = insertRes.rows[0];

        // Send invitation / verification email
        const verifyLink = `${BASE_URL}/team-auth/verify?token=${verificationToken}`;
        const htmlContent = `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 10px;">
                <h1 style="color: #0f172a; font-size: 24px; font-weight: 700; margin-bottom: 16px;">Welcome to Disibin Team</h1>
                <p style="color: #64748b; line-height: 1.6;">Hi ${name}, you've been added as a <strong>${role}</strong> on the Disibin management team.</p>
                <p style="color: #64748b; line-height: 1.6; margin-bottom: 8px;">Your login credentials:</p>
                <p style="color: #64748b;"><strong>Email:</strong> ${email}</p>
                <p style="color: #64748b; margin-bottom: 24px;"><strong>Temporary Password:</strong> ${tempPassword}</p>
                <p style="color: #64748b; margin-bottom: 24px;">Please verify your email to activate your account. You should change your password after first login.</p>
                <a href="${verifyLink}" style="display:inline-block;padding:16px 32px;background:#0f172a;color:#fff;text-decoration:none;border-radius:12px;font-weight:600;">Verify Email &amp; Activate</a>
                <p style="color: #94a3b8; font-size: 12px; margin-top: 32px;">This link expires in 7 days.</p>
            </div>
        `;

        await sendEmail({
            to: email,
            subject: "Welcome to Disibin Team — Verify Your Account",
            htmlContent,
        });

        return NextResponse.json(
            { success: true, message: "Team member created and invitation email sent", data: newMember },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}