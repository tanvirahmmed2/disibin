import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/database/brevo";
import { BASE_URL } from "@/lib/database/secret";

export async function POST(req) {
    try {
        const { name, email, phone, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        // Check if user exists
        const existingRes = await dbQuery("SELECT user_id FROM users WHERE email = $1", [email]);
        if (existingRes.rows.length > 0) {
            return NextResponse.json({ success: false, message: 'Email already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiresAt = new Date(Date.now() + 3600000); // 1 hour

        // Insert user
        const insertRes = await dbQuery(`
            INSERT INTO users (
                name, email, phone, password, role, is_active, is_verified, reset_token, token_expires_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING user_id, name, email
        `, [name, email, phone, hashedPassword, 'user', true, false, verificationToken, tokenExpiresAt]);

        const user = insertRes.rows[0];

        // Send email via Brevo
        const verificationUrl = `${BASE_URL}/api/auth/verify-email?token=${verificationToken}&email=${email}`;
        await sendVerificationEmail(email, name, verificationUrl);

        return NextResponse.json({
            success: true,
            message: 'Registration successful! Please check your email to verify.',
            data: { id: user.user_id, name: user.name, email: user.email }
        }, { status: 201 });

    } catch (error) {
        console.error('Registration Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
