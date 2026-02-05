import ConnectDB from "@/lib/database/mongo";
import { Review } from "@/lib/models/review";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await ConnectDB();
        const reviews = await Review.find({ isApproved: true }).sort({ createdAt: -1 }).lean();

        return NextResponse.json({
            success: true,
            payload: reviews || []
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await ConnectDB();
        const { userName, userImage, userImageId, rating, comment } = await req.json();

        if (!userName || !userImage || !userImageId || !rating || !comment) {
            return NextResponse.json({ 
                success: false, 
                message: "Missing required fields" 
            }, { status: 400 });
        }

        const newReview = await Review.create({
            userName,
            userImage,
            userImageId,
            rating,
            comment
        });

        return NextResponse.json({
            success: true,
            message: "Review submitted for approval",
            payload: newReview
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        await ConnectDB();
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ 
                success: false, 
                message: "Review ID required" 
            }, { status: 400 });
        }

        const review = await Review.findById(id);

        if (!review) {
            return NextResponse.json({ 
                success: false, 
                message: "Review not found" 
            }, { status: 404 });
        }

        review.isApproved = !review.isApproved;
        await review.save();

        return NextResponse.json({
            success: true,
            message: review.isApproved ? "Review approved" : "Review hidden",
            payload: review
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        await ConnectDB();
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ 
                success: false, 
                message: "ID is required" 
            }, { status: 400 });
        }

        const deletedReview = await Review.findByIdAndDelete(id);

        if (!deletedReview) {
            return NextResponse.json({ 
                success: false, 
                message: "Review not found" 
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Review deleted successfully"
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}