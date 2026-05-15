import { NextResponse } from "next/server";
import { isManager } from "@/lib/middleware";
import { getProjectBySlug, updateProject, deleteProject } from "@/lib/data/projects";

// GET single project
export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const project = await getProjectBySlug(id);
        
        if (!project) {
            return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: project });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PATCH update project (Manager only)
export async function PATCH(req, { params }) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { id } = await params;
        const body = await req.json();

        const updatedProject = await updateProject(id, body, auth.data.id);
        
        if (!updatedProject) {
            return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Project updated successfully",
            data: updatedProject
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE project (Manager only)
export async function DELETE(req, { params }) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { id } = await params;
        const deletedProject = await deleteProject(id, auth.data.id);

        if (!deletedProject) {
            return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Project deleted successfully",
            data: deletedProject
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
