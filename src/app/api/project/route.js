import { NextResponse } from "next/server";
import { isManager } from "@/lib/middleware";
import { createProject, getAllProjects } from "@/lib/data/projects";

// GET all projects (Public)
export async function GET() {
    try {
        const projects = await getAllProjects();
        return NextResponse.json({ success: true, data: projects });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST create project (Manager only)
export async function POST(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const body = await req.json();
        const { title, slug } = body;

        if (!title || !slug) {
            return NextResponse.json({ success: false, message: "Title and slug are required" }, { status: 400 });
        }

        const project = await createProject(body);
        return NextResponse.json({
            success: true,
            message: "Project created successfully",
            data: project
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
