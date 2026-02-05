import ConnectDB from "@/lib/database/mongo";
import Project from "@/lib/models/project";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await ConnectDB();

        const projects = await Project.find({ isFeatured: true }).sort({ createdAt: -1 }).lean();

        if (!projects || projects.length === 0) {
            return NextResponse.json({ 
                success: true, 
                message: 'No featured projects found', 
                payload: [] 
            }, { status: 200 });
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Successfully fetched data', 
            payload: projects 
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            message: 'Failed to fetch data', 
            error: error.message 
        }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await ConnectDB();

        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ success: false, message: 'Id is required' }, { status: 400 });
        }

        
        const project = await Project.findById(id);

        if (!project) {
            return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 });
        }

        
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