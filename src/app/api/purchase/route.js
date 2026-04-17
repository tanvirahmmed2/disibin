import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import Purchase from "@/lib/models/purchase";
import Wishlist from "@/lib/models/wishlist";
import { createLog } from "@/lib/utils/logger";

export async function GET(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) return NextResponse.json({ success: false, message: "User ID required" }, { status: 400 });

        const purchases = await Purchase.find({ userId }).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, payload: purchases });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();
        const { userId, items, totalAmount, paymentMethod } = body;

        const newPurchase = await Purchase.create({
            userId, items, totalAmount, paymentMethod, status: 'pending'
        });

        // Activity Logging
        await createLog({
            userId,
            action: 'create',
            targetType: 'purchase',
            targetId: newPurchase._id,
            description: `New purchase placed: Order ID ${newPurchase._id.toString().slice(-6)}`,
            metadata: { totalAmount, itemsCount: items.length }
        });

        // Optionally clear wishlist after purchase creation
        await Wishlist.deleteMany({ userId });

        return NextResponse.json({ success: true, payload: newPurchase });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}