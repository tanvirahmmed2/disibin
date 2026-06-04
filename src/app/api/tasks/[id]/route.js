import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isLogin } from "@/lib/middleware";

export async function GET(req, { params }) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });
        
        const { id } = await params;
        
        const res = await dbQuery(`
            SELECT t.*, p.title as project_title 
            FROM internal_tasks t
            JOIN internal_projects p ON t.project_id = p.project_id
            WHERE t.task_id = $1
        `, [id]);
        
        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Task not found" }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, data: res.rows[0] });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req, { params }) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });
        
        const { id } = await params;
        const body = await req.json();
        const { title, description, status, priority, assigned_to, deadline } = body;
        
        // Build dynamic update query
        const updates = [];
        const values = [];
        let index = 1;
        
        if (title !== undefined) { updates.push(`title = $${index++}`); values.push(title); }
        if (description !== undefined) { updates.push(`description = $${index++}`); values.push(description); }
        if (status !== undefined) { updates.push(`status = $${index++}`); values.push(status); }
        if (priority !== undefined) { updates.push(`priority = $${index++}`); values.push(priority); }
        if (assigned_to !== undefined) { updates.push(`assigned_to = $${index++}`); values.push(assigned_to); }
        if (deadline !== undefined) { updates.push(`deadline = $${index++}`); values.push(deadline); }
        
        if (updates.length === 0) {
            return NextResponse.json({ success: false, message: "No fields to update" }, { status: 400 });
        }
        
        values.push(id);
        const query = `
            UPDATE internal_tasks 
            SET ${updates.join(', ')} 
            WHERE task_id = $${index} 
            RETURNING *
        `;
        
        const res = await dbQuery(query, values);
        
        if (res.rows.length === 0) {
             return NextResponse.json({ success: false, message: "Task not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: res.rows[0], message: "Task updated" });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
