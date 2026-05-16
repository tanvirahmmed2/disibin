import { NextResponse } from "next/server";
import { getUserByVerificationToken, verifyUserEmail } from "@/lib/data/users";

export async function POST(req) {
    try {
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json({ success: false, message: "Verification token is required" }, { status: 400 });
        }

        const user = await getUserByVerificationToken(token);

        if (!user) {
            return NextResponse.json({ success: false, message: "Invalid or expired verification token" }, { status: 400 });
        }

        await verifyUserEmail(user.user_id);

        return NextResponse.json({
            success: true,
            message: "Email verified successfully. You can now login."
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
