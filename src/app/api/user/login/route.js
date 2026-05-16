import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { getUserByEmail } from "@/lib/data/users";
import { JWT_SECRET, NODE_ENV } from "@/lib/database/secret";

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 });
        }

        const user = await getUserByEmail(email);
        if (!user) {
            return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
        }

        if (!user.is_active) {
            return NextResponse.json({ success: false, message: "Account is deactivated" }, { status: 403 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
        }

        if (!user.is_verified) {
            return NextResponse.json({ success: false, message: "Please verify your email address before logging in." }, { status: 403 });
        }

        // Generate Token
        const token = jwt.sign(
            { id: user.user_id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Set Cookie
        const cookieStore = await cookies();
        cookieStore.set("disibin", token, {
            httpOnly: true,
            secure: NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: "/",
        });

        // Remove password from response
        const { password: _, ...userData } = user;

        return NextResponse.json({
            success: true,
            message: "Login successful",
            data: userData
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
