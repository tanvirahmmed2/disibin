import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbQuery } from "@/lib/database/pg";

export async function POST(req) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json({ success: false, message: "Token and password are required" }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ success: false, message: "Password must be at least 6 characters" }, { status: 400 });
        }

        const query = `
            SELECT user_id, email, token_expires_at 
            FROM users 
            WHERE reset_token = $1 AND token_expires_at > now()
        `;
        const res = await dbQuery(query, [token]);
        const user = res.rows[0];

        if (!user) {
            return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        await dbQuery(`
            UPDATE users 
            SET password = $1, reset_token = NULL, token_expires_at = NULL, updated_at = now() 
            WHERE user_id = $2 
        `, [hashedPassword, user.user_id]);

        return NextResponse.json({ 
            success: true, 
            message: "Password reset successful. You can now login with your new password." 
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
