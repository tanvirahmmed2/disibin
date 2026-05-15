import { NextResponse } from "next/server";
import { hasRole } from "@/lib/middleware";
import { approveReview, replyToReview, deleteReview } from "@/lib/data/reviews";

// Admin/Support actions on specific reviews
export async function PATCH(req, { params }) {
    try {
        const auth = await hasRole(['admin', 'support', 'manager']);
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { id } = await params;
        const { is_approved, reply } = await req.json();

        let updatedReview = null;

        // Approval toggle
        if (is_approved !== undefined) {
            updatedReview = await approveReview(id, is_approved);
        }

        // Reply addition
        if (reply !== undefined) {
            updatedReview = await replyToReview(id, reply);
        }

        if (!updatedReview) {
            return NextResponse.json({ success: false, message: "No action performed" }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: "Review updated successfully",
            data: updatedReview
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const auth = await hasRole(['admin', 'manager']);
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { id } = await params;
        const deletedReview = await deleteReview(id);

        if (!deletedReview) {
            return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Review deleted successfully"
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
