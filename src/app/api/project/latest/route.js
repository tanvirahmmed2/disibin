import ConnectDB from "@/lib/database/mongo";
import Project from "@/lib/models/project";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await ConnectDB()

        const projects=await Project.find({}).sort({createdAt:-1}).limit(-3)

        if(!projects){
            return NextResponse.json({success: false, message: 'No project data found'}, {status:400})

        }

        return NextResponse.json({success:true, message:'Successfully fetched data', payload: projects}, {status:200})
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to fetch data', error: error.message}, {status:500})
        
    }
    
}