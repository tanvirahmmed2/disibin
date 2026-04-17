import { NextResponse } from "next/server";

export async function GET() {
    try {
        const res = NextResponse.json({
            success: true,
            message: "Logout successful",
        });

        res.cookies.set("disibin", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            expires: new Date(0),
            path: "/",
            sameSite: "strict"
        });

        return res;
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Failed to logout",
            error: error.message
        }, { status: 500 });
    }
}