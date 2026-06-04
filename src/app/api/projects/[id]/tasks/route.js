import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isLogin } from "@/lib/middleware";

export async function GET(req, { params }) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });
        
        const { id } = await params;
        const user = auth.data;

        // Same access check logic
        let accessCheck = false;
        if (user.role === 'admin' || user.role === 'manager') {
            accessCheck = true;
        } else if (user.role === 'developer') {
            const checkRes = await dbQuery("SELECT 1 FROM project_assignments WHERE project_id = $1 AND developer_id = $2", [id, user.id]);
            if (checkRes.rows.length > 0) accessCheck = true;
        }

        if (!accessCheck) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        const res = await dbQuery(`
            SELECT t.*, 
                   u1.name as assigned_name, 
                   u2.name as creator_name,
                   (SELECT COUNT(*) FROM task_comments WHERE task_id = t.task_id) as comments_count
            FROM internal_tasks t
            LEFT JOIN users u1 ON t.assigned_to = u1.user_id
            LEFT JOIN users u2 ON t.created_by = u2.user_id
            WHERE t.project_id = $1
            ORDER BY t.created_at DESC
        `, [id]);

        return NextResponse.json({ success: true, data: res.rows });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req, { params }) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });
        
        // Both managers and assigned developers could potentially create tasks, 
        // but let's restrict task creation to managers for this project structure,
        // or allow developers to create tasks if they are assigned. Let's allow managers and assigned devs.
        const { id } = await params;
        const user = auth.data;

        let accessCheck = false;
        if (user.role === 'admin' || user.role === 'manager') {
            accessCheck = true;
        } else if (user.role === 'developer') {
            const checkRes = await dbQuery("SELECT 1 FROM project_assignments WHERE project_id = $1 AND developer_id = $2", [id, user.id]);
            if (checkRes.rows.length > 0) accessCheck = true;
        }

        if (!accessCheck) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const { title, description, priority, assigned_to, deadline } = body;

        if (!title) {
            return NextResponse.json({ success: false, message: "Title is required" }, { status: 400 });
        }

        // Create the task
        const res = await dbQuery(`
            INSERT INTO internal_tasks (project_id, title, description, priority, assigned_to, created_by, deadline)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `, [id, title, description || null, priority || 'medium', assigned_to || null, user.id, deadline || null]);
        
        return NextResponse.json({ success: true, data: res.rows[0], message: "Task created successfully" });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
