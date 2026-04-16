import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import { Blog } from "@/lib/models/blog";

export async function GET(req, { params }) {
    try {
        await connectDB();
        const { slug } = await params;

        if (!slug) {
            return NextResponse.json({ success: false, message: 'slug not found' }, { status: 400 });
        }

        const blog = await Blog.findOne({ slug });

        if (!blog) {
            return NextResponse.json({ success: false, message: 'No blog found with this slug' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'blog data found successfully',
            payload: blog
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}