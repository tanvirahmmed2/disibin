import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    try {
        const response = NextResponse.json({
            success: true,
            message: "Logged out successfully"
        });

        response.cookies.set("disibin", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 0,
            path: "/",
        });

        return response;
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
