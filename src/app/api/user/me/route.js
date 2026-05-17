import { NextResponse } from "next/server";
import { isLogin } from "@/lib/middleware";

export async function GET(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
        
        return NextResponse.json({ success: true, data: auth.data });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
