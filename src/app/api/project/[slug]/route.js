import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import { Project } from "@/lib/models/project";

export async function GET(req, { params }) {
    try {
        await connectDB();
        const { slug } = await params;

        if (!slug) {
            return NextResponse.json({ success: false, message: 'slug not found' }, { status: 400 });
        }

        const project = await Project.findOne({ slug });

        if (!project) {
            return NextResponse.json({ success: false, message: 'No project found with this slug' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'project data found successfully',
            payload: project
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}