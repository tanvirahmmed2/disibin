import { NextResponse } from "next/server";
import { isLogin, isManager } from "@/lib/middleware";
import { approveReview, deleteReview, getReviewByUser } from "@/lib/data/reviews";

// PATCH - Approve or reject a review (Manager only)
export async function PATCH(req, { params }) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { id } = await params;
        const { is_approved } = await req.json();

        if (is_approved === undefined) {
            return NextResponse.json({ success: false, message: "Approval status is required" }, { status: 400 });
        }

        const review = await approveReview(id, is_approved, auth.data.id);
        
        if (!review) {
            return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: `Review ${is_approved ? 'approved' : 'rejected'} successfully`,
            data: review
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE - Remove a review (User deletes their own, Manager can delete any)
export async function DELETE(req, { params }) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const { id } = await params;
        
        // Check if user is manager
        const managerAuth = await isManager();
        const isUserManager = managerAuth.success;

        if (!isUserManager) {
            // If just a regular user, verify this is THEIR review
            const userReview = await getReviewByUser(auth.data.id);
            if (!userReview || userReview.review_id.toString() !== id) {
                return NextResponse.json({ success: false, message: "Unauthorized to delete this review" }, { status: 403 });
            }
        }

        const deletedReview = await deleteReview(id, auth.data.id);

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
