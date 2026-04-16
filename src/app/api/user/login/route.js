import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import User from "@/lib/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req) {
    try {
        await connectDB();
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
        }

        if (!user.isActive) {
            return NextResponse.json({ success: false, message: "Account is disabled. Contact support." }, { status: 403 });
        }

        if (!user.isVerified) {
            return NextResponse.json({ success: false, message: "Email not verified. Please check your inbox.", isUnverified: true }, { status: 403 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
        }

        const tokenData = {
            _id: user._id,
            email: user.email,
            role: user.role
        };

        const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1d' });
        
        const cookieStore = await cookies();
        cookieStore.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
        });

        const response = NextResponse.json({
            success: true,
            message: `Welcome back, ${user.name}!`,
            payload: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

        return response;

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to login',
            error: error.message
        }, { status: 500 });
    }
}