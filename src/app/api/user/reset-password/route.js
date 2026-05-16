import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserByResetToken, updateUserPassword } from "@/lib/data/users";

export async function POST(req) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json({ success: false, message: "Token and password are required" }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ success: false, message: "Password must be at least 6 characters" }, { status: 400 });
        }

        const user = await getUserByResetToken(token);
        if (!user) {
            return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await updateUserPassword(user.user_id, hashedPassword);

        return NextResponse.json({ 
            success: true, 
            message: "Password reset successful. You can now login with your new password." 
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
