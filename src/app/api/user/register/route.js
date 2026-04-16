import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import User from "@/lib/models/user";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/database/brevo";

export async function POST(req) {
    try {
        await connectDB();
        const { name, email, phone, password } = await req.json();

        if (!name || !email || !phone || !password) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ success: false, message: 'Email already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiresAt = new Date(Date.now() + 3600000); // 1 hour

        const user = await User.create({
            name,
            email,
            phone,
            password: hashedPassword,
            isVerified: false,
            resetToken: verificationToken,
            tokenExpiresAt
        });

        const verificationUrl = `${process.env.BASE_URL}/verify-email?token=${verificationToken}&email=${email}`;
        await sendVerificationEmail(email, name, verificationUrl);

        return NextResponse.json({
            success: true,
            message: 'Registration successful! Please check your email to verify your account.',
            payload: { id: user._id, name: user.name, email: user.email }
        }, { status: 201 });

    } catch (error) {
        console.error('Registration Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}