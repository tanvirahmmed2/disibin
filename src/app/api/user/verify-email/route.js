import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import User from "@/lib/models/user";

export async function GET(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const token = searchParams.get('token');
        const email = searchParams.get('email');

        if (!token || !email) {
            return NextResponse.json({ success: false, message: 'Invalid verification link' }, { status: 400 });
        }

        const user = await User.findOne({ 
            email, 
            resetToken: token,
            tokenExpiresAt: { $gt: new Date() }
        });

        if (!user) {
            return NextResponse.json({ success: false, message: 'Invalid or expired verification link' }, { status: 400 });
        }

        user.isVerified = true;
        user.resetToken = null;
        user.tokenExpiresAt = null;
        await user.save();

        return NextResponse.json({
            success: true,
            message: 'Email verified successfully! You can now log in.'
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
