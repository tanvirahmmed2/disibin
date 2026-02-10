import ConnectDB from "@/lib/database/mongo";
import Blog from "@/lib/models/blog";
import { NextResponse } from "next/server";


export async function GET(req, { params }) {
    try {
        await ConnectDB()
        const { slug } = await params

        if (!slug) {
            return NextResponse.json({
                success: false,
                message: 'id not found'
            }, { status: 400 })
        }

        const blog = await Blog.findOne({ slug })

        if (!blog) {
            return NextResponse.json({
                success: false,
                message: 'No blog found with this slug'
            }, { status: 400 })
        }

        return NextResponse.json({
            success: true,
            message: 'blog data found successfully',
            payload: blog
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch data',
            error: error.message
        }, { status: 500 })
    }

}


