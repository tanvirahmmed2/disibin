import ConnectDB from "@/lib/database/mongo";
import Project from "@/lib/models/project";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await ConnectDB();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.trim() === "") {
      return NextResponse.json({
        success: false,
        message: "Search query is required",
      }, { status: 400 });
    }

    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedQuery, "i");

    const projects = await Project.find({
      $or: [
        { title: regex },
        { category: regex },
        { description: regex }
      ]
    })
    .select("-imageId")
    .limit(20)
    .lean();

    if (!projects || projects.length === 0) {
      return NextResponse.json({
        success: true, // Changed to true: empty result is a valid state
        message: 'No project Found',
        payload: []
      }, { status: 200 });
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully fetched data',
      payload: projects,
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    }, { status: 500 });
  }
}