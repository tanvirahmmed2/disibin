import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/middleware";
import { getPayments } from "@/lib/data/payments";

export async function GET(req) {
    try {
        const auth = await isAdmin();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const payments = await getPayments();
        return NextResponse.json({ success: true, data: payments });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
