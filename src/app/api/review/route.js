import { NextResponse } from "next/server";
import { isLogin, hasRole } from "@/lib/middleware";
import { 
    createReview, 
    getPublicReviews, 
    getAllReviews, 
    approveReview, 
    replyToReview, 
    deleteReview 
} from "@/lib/data/reviews";

// GET reviews
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get('productId');
        const showAll = searchParams.get('all') === 'true';

        // Only staff can see unapproved reviews
        if (showAll) {
            const auth = await hasRole(['admin', 'support', 'manager']);
            if (auth.success) {
                const reviews = await getAllReviews();
                return NextResponse.json({ success: true, data: reviews });
            }
        }

        // Public approved reviews
        const reviews = await getPublicReviews(productId);
        return NextResponse.json({ success: true, data: reviews });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST submit review
export async function POST(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const body = await req.json();
        const { product_id, rating, comment } = body;

        if (!product_id || !rating) {
            return NextResponse.json({ success: false, message: "Product ID and Rating are required" }, { status: 400 });
        }

        const review = await createReview({
            user_id: auth.data.id,
            product_id,
            rating,
            comment
        });

        return NextResponse.json({
            success: true,
            message: "Review submitted and awaiting approval",
            data: review
        }, { status: 201 });

    } catch (error) {
        if (error.code === '23505') {
            return NextResponse.json({ success: false, message: "You have already submitted a review" }, { status: 400 });
        }
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PATCH update/approve/reply
export async function PATCH(req) {
    try {
        const auth = await hasRole(['admin', 'support', 'manager']);
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { reviewId, is_approved } = await req.json();

        if (!reviewId) {
            return NextResponse.json({ success: false, message: "Review ID is required" }, { status: 400 });
        }

        let updatedReview = null;

        if (is_approved !== undefined) {
            updatedReview = await approveReview(reviewId, is_approved);
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

// DELETE review
export async function DELETE(req) {
    try {
        const auth = await hasRole(['admin', 'manager']);
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { searchParams } = new URL(req.url);
        const reviewId = searchParams.get('id');

        if (!reviewId) {
            return NextResponse.json({ success: false, message: "Review ID is required" }, { status: 400 });
        }

        const deletedReview = await deleteReview(reviewId);

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
