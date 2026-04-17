import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import Purchase from "@/lib/models/purchase";

export async function GET(req, { params }) {
    try {
        await connectDB();
        const { id } = params;

        const purchase = await Purchase.findById(id);
        if (!purchase) return NextResponse.json({ success: false, message: "Purchase not found" }, { status: 404 });

        return NextResponse.json({ success: true, payload: purchase });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
