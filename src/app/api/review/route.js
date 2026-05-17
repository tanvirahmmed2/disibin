import { NextResponse } from "next/server";
import { isLogin, isManager } from "@/lib/middleware";
import { createReview, getReviewByUser, getAllReviews } from "@/lib/data/reviews";

// POST - Create a review (User only)
export async function POST(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const body = await req.json();
        const { rating, comment } = body;

        if (!rating) {
            return NextResponse.json({ success: false, message: "Rating is required" }, { status: 400 });
        }

        const review = await createReview({
            user_id: auth.data.id,
            rating,
            comment
        });

        return NextResponse.json({
            success: true,
            message: "Review submitted successfully and is pending approval.",
            data: review
        }, { status: 201 });

    } catch (error) {
        if (error.message.includes("already submitted")) {
            return NextResponse.json({ success: false, message: error.message }, { status: 400 });
        }
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// GET - Fetch reviews
export async function GET(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');

        // Managers requesting all reviews
        if (type === 'all') {
            const managerAuth = await isManager();
            if (!managerAuth.success) return NextResponse.json(managerAuth, { status: 403 });
            
            const reviews = await getAllReviews();
            return NextResponse.json({ success: true, data: reviews });
        }

        // Users requesting their own review
        const userReview = await getReviewByUser(auth.data.id);
        return NextResponse.json({ success: true, data: userReview });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
