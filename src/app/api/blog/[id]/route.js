import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import { Blog } from "@/lib/models/blog";

export async function GET(req, { params }) {
    try {
        await connectDB();
        const { id } = params;
        const blog = await Blog.findById(id);
        if (!blog) return NextResponse.json({ success: false, message: 'Blog not found' }, { status: 404 });
        
        return NextResponse.json({
            success: true,
            message: 'Blog data found successfully',
            payload: blog
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
