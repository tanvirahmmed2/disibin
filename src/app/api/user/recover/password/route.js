import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/database/db';
import User from '@/lib/models/user';

export async function PATCH(req) {
    try {
        await connectDB();
        const { email, otp, new_password } = await req.json();

        
        const user = await User.findOne({
            email,
            resetToken: otp,
            tokenExpiresAt: { $gt: Date.now() }
        });

        if (!user) {
            return NextResponse.json({ success: false, message: "Invalid or expired OTP" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(new_password, 10);

        user.password = hashedPassword;
        user.resetToken = null;
        user.tokenExpiresAt = null;
        await user.save();

        return NextResponse.json({ success: true, message: "Password updated successfully. Please login." });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}