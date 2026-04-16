import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import { isLogin } from "@/lib/middleware";
import User from "@/lib/models/user";

export async function GET() {
    try {
        await connectDB();
        const auth = await isLogin();
        
        if (!auth.success) {
            return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        }

        
        return NextResponse.json({
            success: true,
            message: 'User is authenticated',
            payload: auth.payload
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}