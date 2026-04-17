import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import Wishlist from "@/lib/models/wishlist";

export async function DELETE(req, { params }) {
    try {
        await connectDB();
        const { id } = params;

        const deletedItem = await Wishlist.findByIdAndDelete(id);
        if (!deletedItem) return NextResponse.json({ success: false, message: "Item not found" }, { status: 404 });

        return NextResponse.json({ success: true, message: "Item removed from wishlist" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
