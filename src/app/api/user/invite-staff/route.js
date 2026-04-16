import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import User from "@/lib/models/user";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { isManager } from "@/lib/middleware";
import { sendStaffInvitationEmail } from "@/lib/database/brevo";

export async function POST(req) {
    try {
        await connectDB();
        const auth = await isManager();
        if (!auth.success) {
            return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        }

        const { email, name } = await req.json();

        if (!email || !name) {
            return NextResponse.json({ success: false, message: 'Email and Name are required' }, { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ success: false, message: 'User already exists' }, { status: 400 });
        }

        const activationToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiresAt = new Date(Date.now() + 86400000 * 7); 
        const tempPassword = await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 10);

        await User.create({
            name,
            email,
            phone: 'PENDING',
            password: tempPassword,
            role: 'staff',
            isVerified: false,
            resetToken: activationToken,
            tokenExpiresAt
        });

        const activationUrl = `${process.env.BASE_URL}/complete-setup?token=${activationToken}&email=${email}`;
        await sendStaffInvitationEmail(email, name, activationUrl);

        return NextResponse.json({
            success: true,
            message: 'Staff invitation sent successfully!'
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
