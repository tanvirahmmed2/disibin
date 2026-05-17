import { NextResponse } from "next/server";
import { hasRole } from "@/lib/middleware";
import { getTaskMessages, addTaskMessage, getTaskById } from "@/lib/data/tasks";

const MANAGEMENT_ROLES = ['admin', 'manager', 'support', 'developer'];

// GET chat messages for a specific task
export async function GET(req, { params }) {
    try {
        const auth = await hasRole(MANAGEMENT_ROLES);
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const taskId = params.id;
        
        // Authorization check
        const task = await getTaskById(taskId);
        if (!task) return NextResponse.json({ success: false, message: "Task not found" }, { status: 404 });
        
        if (auth.data.role === 'developer' || auth.data.role === 'support') {
            if (task.assigned_to !== auth.data.id && task.created_by !== auth.data.id) {
                return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
            }
        }

        const messages = await getTaskMessages(taskId);
        return NextResponse.json({ success: true, data: messages });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST add a new chat message to a task
export async function POST(req, { params }) {
    try {
        const auth = await hasRole(MANAGEMENT_ROLES);
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const taskId = params.id;
        const userId = auth.data.id;
        const { message } = await req.json();

        if (!message) {
            return NextResponse.json({ success: false, message: "Message content is required" }, { status: 400 });
        }

        // Authorization check
        const task = await getTaskById(taskId);
        if (!task) return NextResponse.json({ success: false, message: "Task not found" }, { status: 404 });

        if (auth.data.role === 'developer' || auth.data.role === 'support') {
            if (task.assigned_to !== auth.data.id && task.created_by !== auth.data.id) {
                return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
            }
        }

        const newMessage = await addTaskMessage(taskId, userId, message);
        
        return NextResponse.json({
            success: true,
            message: "Message sent",
            data: newMessage
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
