import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import User from "@/lib/models/user";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/database/brevo";

export async function POST(req) {
    try {
        await connectDB();
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
        }

        const user = await User.findOne({ email, isVerified: false });
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found or already verified' }, { status: 400 });
        }

        const verificationToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiresAt = new Date(Date.now() + 3600000); 

        user.resetToken = verificationToken;
        user.tokenExpiresAt = tokenExpiresAt;
        await user.save();

        const verificationUrl = `${process.env.BASE_URL}/verify-email?token=${verificationToken}&email=${email}`;
        await sendVerificationEmail(email, user.name, verificationUrl);

        return NextResponse.json({
            success: true,
            message: 'Verification email resent successfully!'
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
