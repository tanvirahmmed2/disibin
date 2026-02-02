
import ConnectDB from "@/lib/database/mongo";
import Project from "@/lib/models/project";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await ConnectDB();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({
        success: false,
        message: "Search query is required",
      }, { status: 400 });
    }

    const regex = new RegExp(query, "i"); 

    const projects = await Project.find({
      $or: [
        { title: regex },
        { description: regex }
      ]
    }).limit(20);
    if(!projects || projects.length===0){
        return NextResponse.json({
            success:false,
            message:'No project Found'
        },{status:400})
    }

    return NextResponse.json({
      success: true,
      message:'Successfully fethced data',
      payload: projects,
    },{status:200});

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    }, { status: 500 });
  }
}
