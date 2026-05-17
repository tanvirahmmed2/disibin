import { NextResponse } from "next/server";
import { hasRole } from "@/lib/middleware";
import { getTasks, createTask } from "@/lib/data/tasks";

const MANAGEMENT_ROLES = ['admin', 'manager', 'support', 'developer'];

// GET all tasks for the current user based on role
export async function GET(req) {
    try {
        const auth = await hasRole(MANAGEMENT_ROLES);
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const userId = auth.data.id;
        const role = auth.data.role;

        const tasks = await getTasks(role, userId);
        return NextResponse.json({ success: true, data: tasks });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST create a new task (Managers/Admins only)
export async function POST(req) {
    try {
        const auth = await hasRole(['admin', 'manager']);
        if (!auth.success) return NextResponse.json({ success: false, message: "Only managers can create tasks" }, { status: 403 });

        const createdBy = auth.data.id;
        const data = await req.json();

        if (!data.title || !data.assigned_to) {
            return NextResponse.json({ success: false, message: "Title and Assignee are required" }, { status: 400 });
        }

        const newTask = await createTask({ ...data, created_by: createdBy });
        
        return NextResponse.json({
            success: true,
            message: "Task created successfully",
            data: newTask
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
