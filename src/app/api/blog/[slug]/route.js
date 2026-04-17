import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import { Blog } from "@/lib/models/blog";
import mongoose from "mongoose";

export async function GET(req, { params }) {
    try {
        await connectDB();
        const { slug } = await params;

        if (!slug) {
            return NextResponse.json({ success: false, message: 'identifier not found' }, { status: 400 });
        }

        
        let blog;
        if (mongoose.Types.ObjectId.isValid(slug)) {
            blog = await Blog.findById(slug);
        }
        
        if (!blog) {
            blog = await Blog.findOne({ slug });
        }

        if (!blog) {
            return NextResponse.json({ success: false, message: 'No blog found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'blog data found successfully',
            data: blog
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
