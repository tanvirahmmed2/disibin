import cloudinary from "@/lib/database/cloudinary";
import ConnectDB from "@/lib/database/mongo";
import { Review } from "@/lib/models/review";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await ConnectDB();
        const reviews = await Review.find().sort({ createdAt: -1 }).lean();

        return NextResponse.json({
            success: true,
            payload: reviews || []
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await ConnectDB();

        const data = await req.formData();
        const name = data.get('name');
        const rating = data.get('rating');
        const comment = data.get('comment');
        const imageFile = data.get('image');

        if (!name || !rating || !comment || !imageFile) {
            return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
        }

        const buffer = Buffer.from(await imageFile.arrayBuffer());
        
        const cloudImage = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "reviews" }, // Changed folder name to 'reviews' for better organization
                (err, result) => { if (err) reject(err); else resolve(result); }
            );
            stream.end(buffer);
        });

        const newReview = await Review.create({
            userName: name,
            userImage: cloudImage.secure_url,
            userImageId: cloudImage.public_id,
            rating: Number(rating), // BUG FIX: Ensure rating is stored as a Number
            comment
        });

        return NextResponse.json({
            success: true,
            message: "Review submitted for approval",
            payload: newReview
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        await ConnectDB();
        const { id } = await req.json();

        if (!id) return NextResponse.json({ success: false, message: "Review ID required" }, { status: 400 });

        const review = await Review.findById(id);
        if (!review) return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 });

        review.isApproved = !review.isApproved;
        await review.save();

        return NextResponse.json({
            success: true,
            message: review.isApproved ? "Review approved" : "Review hidden",
            payload: review
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        await ConnectDB();
        const { id } = await req.json();

        const review = await Review.findById(id);
        if (!review) return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 });

        // BUG FIX: Delete the image from Cloudinary when deleting from DB
        if (review.userImageId) {
            await cloudinary.uploader.destroy(review.userImageId);
        }

        await Review.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: "Review and associated image deleted"
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}