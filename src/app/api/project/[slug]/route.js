import ConnectDB from "@/lib/database/mongo";
import Project from "@/lib/models/project";
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

        const project = await Project.findOne({ slug })

        if (!project) {
            return NextResponse.json({
                success: false,
                message: 'No project found with this slug'
            }, { status: 400 })
        }

        return NextResponse.json({
            success: true,
            message: 'Project data found successfully',
            payload: project
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch data',
            error: error.message
        }, { status: 500 })
    }

}


