import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import User from "@/lib/models/user";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        await connectDB();
        const { token, email, password, name, phone } = await req.json();

        if (!token || !email || !password || !name || !phone) {
            return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
        }

        const user = await User.findOne({
            email,
            resetToken: token,
            tokenExpiresAt: { $gt: new Date() }
        });

        if (!user) {
            return NextResponse.json({ success: false, message: 'Invalid or expired setup link' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.name = name;
        user.phone = phone;
        user.password = hashedPassword;
        user.isVerified = true;
        user.resetToken = null;
        user.tokenExpiresAt = null;
        await user.save();

        return NextResponse.json({
            success: true,
            message: 'Account setup successfully! You can now log in.'
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
