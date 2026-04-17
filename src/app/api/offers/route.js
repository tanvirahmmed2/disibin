import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import Offer from "@/lib/models/offer";
import { User } from "@/lib/models/user";
import { createLog } from "@/lib/utils/logger";

export async function GET(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get('slug');

        if (slug) {
            const offer = await Offer.findOne({ slug, status: 'active' });
            if (!offer) return NextResponse.json({ success: false, message: "Offer not found" }, { status: 404 });
            return NextResponse.json({ success: true, payload: offer });
        }

        const offers = await Offer.find({ status: 'active' }).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, payload: offers });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectDB();
        // Permission check should be handled by middleware or here
        // For now, I'll assume userId is passed or retrieved from session
        const body = await req.json();
        const { title, slug, description, price, discount, features, createdBy } = body;

        // Simple role check (assuming user is fetched or passed)
        const user = await User.findById(createdBy);
        if (!user || (user.role !== 'editor' && user.role !== 'admin')) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        const newOffer = await Offer.create({
            title, slug, description, price, discount, features, createdBy, status: 'active'
        });

        // Activity Logging
        await createLog({
            userId: createdBy,
            action: 'create',
            targetType: 'offer',
            targetId: newOffer._id,
            description: `Created new offer: ${newOffer.title}`,
            metadata: { price: newOffer.price, discount: newOffer.discount }
        });

        return NextResponse.json({ success: true, payload: newOffer });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
