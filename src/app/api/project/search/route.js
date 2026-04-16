import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import { Project } from "@/lib/models/project";

export async function GET(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q');

        if (!query) {
            return NextResponse.json({ success: false, message: 'Search query is required' }, { status: 400 });
        }

        const regex = new RegExp(query, 'i');
        const projects = await Project.find({
            $or: [
                { title: regex },
                { category: regex },
                { description: regex }
            ]
        }).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            message: 'Search results found',
            payload: projects
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}