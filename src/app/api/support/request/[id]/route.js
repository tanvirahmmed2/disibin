import { NextResponse } from "next/server";
import { isSupport } from "@/lib/middleware";
import { updateSupportRequestStatus, deleteSupportRequest, getSupportRequestById } from "@/lib/data/supports";

// PATCH update support request (Reply)
export async function PATCH(req, { params }) {
    try {
        const auth = await isSupport();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const { id } = await params;
        const body = await req.json();
        
        // Check if request exists
        const existing = await getSupportRequestById(id);
        if (!existing) {
            return NextResponse.json({ success: false, message: "Support request not found" }, { status: 404 });
        }

        const support = await updateSupportRequestStatus(id, auth.data.id);

        return NextResponse.json({
            success: true,
            message: "Support request marked as replied",
            data: support
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE support request
export async function DELETE(req, { params }) {
    try {
        const auth = await isSupport();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const { id } = await params;
        
        const support = await deleteSupportRequest(id);
        if (!support) {
            return NextResponse.json({ success: false, message: "Support request not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Support request deleted successfully",
            data: support
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
