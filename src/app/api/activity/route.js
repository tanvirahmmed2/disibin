import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/middleware";
import { getLogs } from "@/lib/data/logs";

export async function GET(req) {
    try {
        const auth = await isAdmin();
        if (!auth.success) {
            return NextResponse.json(auth, { status: 403 });
        }

        const logs = await getLogs();
        return NextResponse.json({ success: true, data: logs });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
