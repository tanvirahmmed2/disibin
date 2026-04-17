import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import Wishlist from "@/lib/models/wishlist";

export async function GET(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) return NextResponse.json({ success: false, message: "User ID required" }, { status: 400 });

        const items = await Wishlist.find({ userId }).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, message: 'Wishlist fetched', data: items });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();
        const { userId, itemId, type, title, price, image, slug, metadata } = body;

        // Check for duplicates
        const existing = await Wishlist.findOne({ userId, itemId, type });
        if (existing) {
            return NextResponse.json({ success: false, message: "Item already in wishlist" }, { status: 400 });
        }

        const newItem = await Wishlist.create({
            userId, itemId, type, title, price, image, slug, metadata
        });

        return NextResponse.json({ success: true, message: 'Item added to wishlist', data: newItem });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
