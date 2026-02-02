import ConnectDB from "@/lib/database/mongo";
import Project from "@/lib/models/project";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await ConnectDB();
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');

        const filter = {};
        if (category) filter.category = category;

        const projects = await Project.find(filter).sort({ _id: -1 }).limit(30);;

        return NextResponse.json({ success: true,message:'Successfully fetched data', payload: projects });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to fetch data', error: error.message }, { status: 500 });
    }
}