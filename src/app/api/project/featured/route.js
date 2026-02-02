import ConnectDB from "@/lib/database/mongo";

import Project from "@/lib/models/project";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await ConnectDB()

        const projects = await Project.find({ isFeatured: true }).sort({ createdAt: -1 })

        if (!projects) {
            return NextResponse.json({ success: false, message: 'No project data found' }, { status: 400 })

        }

        return NextResponse.json({ success: true, message: 'Successfully fetched data', payload: projects }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to fetch data', error: error.message }, { status: 500 })

    }

}

export async function POST(req) {
    try {
        await ConnectDB();

        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ success: false, message: 'Id not received' }, { status: 400 });
        }

        const project = await Project.findById(id);

        if (!project) {
            return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 });
        }

        const newStatus = !project.isFeatured;
        
        const updateProject= await Project.findByIdAndUpdate(id, { isFeatured: newStatus });
        if(!updateProject){
            return NextResponse.json({
                success:false, message:'Failed to update status'
            },{status:400})
        }

        return NextResponse.json({
            success: true,
            message: newStatus ? 'Added to featured' : 'Removed from featured'
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            message: 'Failed to update featured status', 
            error: error.message 
        }, { status: 500 });
    }
}