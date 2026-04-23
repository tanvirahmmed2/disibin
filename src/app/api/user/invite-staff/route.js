import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { isManager } from "@/lib/middleware";
import { sendStaffInvitationEmail } from "@/lib/database/brevo";
import { BASE_URL } from "@/lib/database/secret";

export async function POST(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const { email, name } = await req.json();
        if (!email || !name) return NextResponse.json({ success: false, message: 'Email and Name are required' }, { status: 400 });

        const existingRes = await dbQuery("SELECT user_id FROM users WHERE email = $1", [email]);
        if (existingRes.rows.length > 0) return NextResponse.json({ success: false, message: 'User already exists' }, { status: 400 });

        const activationToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiresAt = new Date(Date.now() + 86400000 * 7); 
        const tempPassword = await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 10);

        await dbQuery(`
            INSERT INTO users (name, email, phone, password, role, is_active, is_verified, reset_token, token_expires_at)
            VALUES ($1, $2, 'PENDING', $3, 'developer', true, false, $4, $5)
        `, [name, email, tempPassword, activationToken, tokenExpiresAt]);

        const activationUrl = `${BASE_URL}/complete-setup?token=${activationToken}&email=${email}`;
        await sendStaffInvitationEmail(email, name, activationUrl);

        return NextResponse.json({
            success: true,
            message: 'Staff invitation sent successfully!'
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
