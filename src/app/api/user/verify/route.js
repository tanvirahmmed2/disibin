import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";

export async function POST(req) {
    try {
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json({ success: false, message: "Verification token is required" }, { status: 400 });
        }

        const query = `
            SELECT user_id, email, verification_expires_at 
            FROM users 
            WHERE verification_token = $1 AND verification_expires_at > now()
        `;
        const res = await dbQuery(query, [token]);
        const user = res.rows[0];

        if (!user) {
            return NextResponse.json({ success: false, message: "Invalid or expired verification token" }, { status: 400 });
        }

        await dbQuery(`
            UPDATE users 
            SET is_verified = TRUE, verification_token = NULL, verification_expires_at = NULL, updated_at = now() 
            WHERE user_id = $1 
        `, [user.user_id]);

        return NextResponse.json({
            success: true,
            message: "Email verified successfully. You can now login."
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
