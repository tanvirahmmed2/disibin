import { NextResponse } from "next/server";
import { getAllCategories } from "@/lib/data/categories";

export async function GET() {
    try {
        const categories = await getAllCategories();
        return NextResponse.json({ success: true, data: categories });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
