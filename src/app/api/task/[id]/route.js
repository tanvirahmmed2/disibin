import { NextResponse } from "next/server";
import { hasRole } from "@/lib/middleware";
import { getTaskById, updateTaskStatus } from "@/lib/data/tasks";

const MANAGEMENT_ROLES = ['admin', 'manager', 'support', 'developer'];

// GET a specific task
export async function GET(req, { params }) {
    try {
        const auth = await hasRole(MANAGEMENT_ROLES);
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const taskId = params.id;
        const task = await getTaskById(taskId);
        
        if (!task) {
            return NextResponse.json({ success: false, message: "Task not found" }, { status: 404 });
        }

        // We could add check to ensure developer/support is assigned to this task, 
        // but typically seeing details of other tasks is fine or handled in UI.
        // For strictness:
        if (auth.data.role === 'developer' || auth.data.role === 'support') {
            if (task.assigned_to !== auth.data.id && task.created_by !== auth.data.id) {
                return NextResponse.json({ success: false, message: "Unauthorized to view this task" }, { status: 403 });
            }
        }

        return NextResponse.json({ success: true, data: task });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PATCH update task status
export async function PATCH(req, { params }) {
    try {
        const auth = await hasRole(MANAGEMENT_ROLES);
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const taskId = params.id;
        const { status } = await req.json();

        if (!status) {
            return NextResponse.json({ success: false, message: "Status is required" }, { status: 400 });
        }

        // Verify task exists and authorization
        const task = await getTaskById(taskId);
        if (!task) {
            return NextResponse.json({ success: false, message: "Task not found" }, { status: 404 });
        }

        if (auth.data.role === 'developer' || auth.data.role === 'support') {
            if (task.assigned_to !== auth.data.id && task.created_by !== auth.data.id) {
                return NextResponse.json({ success: false, message: "Unauthorized to update this task" }, { status: 403 });
            }
        }

        const updatedTask = await updateTaskStatus(taskId, status);
        
        return NextResponse.json({
            success: true,
            message: "Task status updated",
            data: updatedTask
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
