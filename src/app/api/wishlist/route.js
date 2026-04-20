import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import Wishlist from "@/lib/models/wishlist";
import { isLogin } from "@/lib/middleware";

export async function GET(req) {
    try {
        await connectDB();
        const auth= await isLogin()
        if(!auth.success){
            return NextResponse.json({
                success:false, message:auth.message
            },{status:400})
        }
        const user = auth.data

        if (!user._id) return NextResponse.json({ success: false, message: "User ID required" }, { status: 400 });

        const items = await Wishlist.find({ userId:user._id }).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, message: 'Wishlist fetched', data: items });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectDB();
        const auth= await isLogin()
        if(!auth.success){
            return NextResponse.json({
                success:false, message:auth.message
            },{status:400})
        }
        const user = auth.data
        const body = await req.json();
        const { itemId, type, title, price, image, slug, metadata } = body;

        
        const existing = await Wishlist.findOne({ userId:user._id, itemId, type });
        if (existing) {
            return NextResponse.json({ success: false, message: "Item already in wishlist" }, { status: 400 });
        }

        const newItem = await Wishlist.create({
            userId:user._id, itemId, type, title, price, image, slug, metadata
        });

        return NextResponse.json({ success: true, message: 'Item added to wishlist', data: newItem });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        await connectDB();

        const auth = await isLogin();
        if (!auth.success) {
            return NextResponse.json({
                success: false,
                message: auth.message
            }, { status: 400 });
        }

        const user = auth.data;
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({
                success: false,
                message: "Item ID required"
            }, { status: 400 });
        }

        const deleted = await Wishlist.findOneAndDelete({
            _id: id,
            userId: user._id
        });

        if (!deleted) {
            return NextResponse.json({
                success: false,
                message: "Item not found"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Item removed from wishlist"
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        await connectDB();

        const auth = await isLogin();
        if (!auth.success) {
            return NextResponse.json({
                success: false,
                message: auth.message
            }, { status: 400 });
        }

        const user = auth.data;

        await Wishlist.deleteMany({ userId: user._id });

        return NextResponse.json({
            success: true,
            message: "Wishlist cleared successfully"
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 });
    }
}