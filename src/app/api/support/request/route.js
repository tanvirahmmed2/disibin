import { NextResponse } from "next/server";
import { isSupport } from "@/lib/middleware";
import { createSupportRequest, getAllSupportRequests } from "@/lib/data/supports";

// GET all support requests (Support role only)
export async function GET(req) {
    try {
        const auth = await isSupport();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const supports = await getAllSupportRequests();
        return NextResponse.json({ success: true, data: supports });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST create support request (Public)
export async function POST(req) {
    try {
        const body = await req.json();
        const { name, email, subject, description } = body;

        if (!name || !email || !subject || !description) {
            return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
        }

        const support = await createSupportRequest({ name, email, subject, description });

        return NextResponse.json({
            success: true,
            message: "Support request submitted successfully",
            data: support
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
