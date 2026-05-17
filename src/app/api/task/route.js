import { NextResponse } from "next/server";
import { hasRole } from "@/lib/middleware";
import { dbQuery } from "@/lib/database/pg";

const MANAGEMENT_ROLES = ['admin', 'manager', 'support', 'developer'];

// GET all tasks for the current user based on role
export async function GET(req) {
    try {
        const auth = await hasRole(MANAGEMENT_ROLES);
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const userId = auth.data.id;
        const role = auth.data.role;

        let query = `
            SELECT t.*, 
                   u.name as assigned_to_name, NULL as assigned_to_image,
                   c.name as created_by_name, NULL as created_by_image
            FROM tasks t
            LEFT JOIN users u ON t.assigned_to = u.user_id
            LEFT JOIN users c ON t.created_by = c.user_id
        `;
        let params = [];

        if (role === 'developer' || role === 'support') {
            query += ` WHERE t.assigned_to = $1 OR t.created_by = $1`;
            params.push(userId);
        }

        query += ` ORDER BY t.created_at DESC`;

        const res = await dbQuery(query, params);
        
        return NextResponse.json({ success: true, data: res.rows });

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

        const { title, description, assigned_to, project_id, status = 'pending', priority = 'medium', due_date } = data;
        
        const projectVal = project_id ? project_id : null;
        const dueDateVal = due_date ? due_date : null;

        const query = `
            INSERT INTO tasks (title, description, assigned_to, created_by, project_id, status, priority, due_date)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `;
        const res = await dbQuery(query, [title, description, assigned_to, createdBy, projectVal, status, priority, dueDateVal]);

        return NextResponse.json({
            success: true,
            message: "Task created successfully",
            data: res.rows[0]
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
