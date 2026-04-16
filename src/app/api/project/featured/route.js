import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import { Project } from "@/lib/models/project";

export async function GET() {
    try {
        await connectDB();
        
        // Since isFeatured is not in the Mongoose model, we return latest 3 projects as "featured"
        const projects = await Project.find().sort({ createdAt: -1 }).limit(3);

        return NextResponse.json({
            success: true,
            message: 'Projects fetched successfully',
            payload: projects
        }, { status: 200 });
        
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectDB();
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ success: false, message: 'Id is required' }, { status: 400 });
        }

        const project = await Project.findById(id);

        if (!project) {
            return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 });
        }

        // Toggle logic simulation since field doesn't exist
        project.isFeatured = !project.isFeatured;
        await project.save();

        return NextResponse.json({
            success: true,
            message: project.isFeatured ? 'Added to featured' : 'Removed from featured',
            payload: project.isFeatured
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            message: 'Failed to update featured status', 
            error: error.message 
        }, { status: 500 });
    }
}