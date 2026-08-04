import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { BASE_URL } from "@/lib/database/secret";
import { dbQuery } from "@/lib/database/pg";
import { sendEmail } from "@/lib/database/brevo";
import { isUserLogin } from "@/lib/auth/user";

// POST — Register a new user
export async function POST(req) {
    try {
        const body = await req.json();
        const { name, email, phone, password } = body;

        if (!name || !email || !password || !phone) {
            return NextResponse.json(
                { success: false, message: "Missing required fields (Name, Email, Phone, Password)" },
                { status: 400 }
            );
        }

        const emailRes = await dbQuery("SELECT id FROM users WHERE email = $1", [email]);
        if (emailRes.rows.length > 0) {
            return NextResponse.json({ success: false, message: "Email already registered" }, { status: 400 });
        }

        const phoneRes = await dbQuery("SELECT id FROM users WHERE phone = $1", [phone]);
        if (phoneRes.rows.length > 0) {
            return NextResponse.json({ success: false, message: "Phone number already registered" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user — no username column in schema
        const userRes = await dbQuery(
            `INSERT INTO users (name, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING id, name, email, created_at`,
            [name, email, phone, hashedPassword]
        );
        const user = userRes.rows[0];

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 24 * 3600000); // 24 hours

        await dbQuery(
            `UPDATE users SET verification_token = $1, verification_expires_at = $2 WHERE id = $3`,
            [verificationToken, expiresAt, user.id]
        );

        const verifyLink = `${BASE_URL}/auth/verify?token=${verificationToken}`;
        const htmlContent = `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 10px;">
                <h1 style="color: #0f172a; font-size: 24px; font-weight: 700; margin-bottom: 16px;">Verify Your Email</h1>
                <p style="color: #64748b; line-height: 1.6; margin-bottom: 24px;">Welcome to Disibin! Please click the button below to verify your email address and activate your account.</p>
                <a href="${verifyLink}" style="display: inline-block; padding: 16px 32px; background-color: #0ea5e9; color: white; text-decoration: none; border-radius: 12px; font-weight: 600; box-shadow: 0 10px 15px -3px rgba(14,165,233,0.3);">Verify Email Address</a>
                <p style="color: #94a3b8; font-size: 12px; margin-top: 32px;">This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
            </div>
        `;

        await sendEmail({ to: email, subject: "Verify Your Account - Disibin", htmlContent });

        return NextResponse.json(
            { success: true, message: "User registered successfully. Please check your email to verify your account." },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PATCH — Update profile (authenticated user)
export async function PATCH(req) {
    try {
        const auth = await isUserLogin();
        if (!auth.success) {
            return NextResponse.json(auth, { status: 401 });
        }

        const userId = auth.data.id;
        const body = await req.json();

        // Strip out protected fields
        const { password, role, email, id, user_id, is_active, is_verified, ...updateData } = body;

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ success: false, message: "No fields to update" }, { status: 400 });
        }

        const keys = Object.keys(updateData);
        for (const key of keys) {
            if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) {
                return NextResponse.json({ success: false, message: "Invalid field name" }, { status: 400 });
            }
        }

        const values = Object.values(updateData);
        const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");

        const res = await dbQuery(
            `UPDATE users SET ${setClause}, updated_at = now() WHERE id = $${keys.length + 1} RETURNING id, name, email, phone, city, country, address_line1, address_line2, state, postal_code`,
            [...values, userId]
        );
        const updatedUser = res.rows[0];

        return NextResponse.json({
            success: true,
            message: "Profile updated successfully",
            data: { ...updatedUser, role: 'user' }
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// GET — Get own profile (authenticated user)
export async function GET() {
    try {
        const auth = await isUserLogin();
        if (!auth.success) {
            return NextResponse.json(auth, { status: 401 });
        }

        const res = await dbQuery(
            `SELECT id, name, email, phone, is_active, is_verified, city, country, address_line1, address_line2, state, postal_code, last_login, created_at, updated_at FROM users WHERE id = $1`,
            [auth.data.id]
        );
        const user = res.rows[0];

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: { ...user, role: 'user' }
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}