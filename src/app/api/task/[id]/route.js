import { NextResponse } from "next/server";
import { hasRole } from "@/lib/middleware";
import { dbQuery } from "@/lib/database/pg";

const MANAGEMENT_ROLES = ['admin', 'manager', 'support', 'developer'];

// GET a specific task
export async function GET(req, { params }) {
    try {
        const auth = await hasRole(MANAGEMENT_ROLES);
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { id: taskId } = await params;
        
        const query = `
            SELECT t.*, 
                   u.name as assigned_to_name, NULL as assigned_to_image, u.role as assigned_to_role,
                   c.name as created_by_name, NULL as created_by_image, c.role as created_by_role
            FROM tasks t
            LEFT JOIN users u ON t.assigned_to = u.user_id
            LEFT JOIN users c ON t.created_by = c.user_id
            WHERE t.task_id = $1
        `;
        const res = await dbQuery(query, [taskId]);
        const task = res.rows[0];
        
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

        const { id: taskId } = await params;
        const { status } = await req.json();

        if (!status) {
            return NextResponse.json({ success: false, message: "Status is required" }, { status: 400 });
        }

        // Verify task exists and authorization
        const query = `SELECT assigned_to, created_by FROM tasks WHERE task_id = $1`;
        const res = await dbQuery(query, [taskId]);
        const task = res.rows[0];

        if (!task) {
            return NextResponse.json({ success: false, message: "Task not found" }, { status: 404 });
        }

        if (auth.data.role === 'developer' || auth.data.role === 'support') {
            if (task.assigned_to !== auth.data.id && task.created_by !== auth.data.id) {
                return NextResponse.json({ success: false, message: "Unauthorized to update this task" }, { status: 403 });
            }
        }

        const updateQuery = `
            UPDATE tasks 
            SET status = $1, updated_at = now() 
            WHERE task_id = $2 
            RETURNING *
        `;
        const updateRes = await dbQuery(updateQuery, [status, taskId]);
        
        return NextResponse.json({
            success: true,
            message: "Task status updated",
            data: updateRes.rows[0]
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
