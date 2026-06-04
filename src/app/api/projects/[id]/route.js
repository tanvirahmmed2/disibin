import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isLogin } from "@/lib/middleware";

export async function GET(req, { params }) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });
        
        const { id } = await params;
        const user = auth.data;

        // Verify access: Admin/Manager can see all, Dev can only see if assigned
        let accessCheck = false;
        if (user.role === 'admin' || user.role === 'manager') {
            accessCheck = true;
        } else if (user.role === 'developer') {
            const checkRes = await dbQuery("SELECT 1 FROM project_assignments WHERE project_id = $1 AND developer_id = $2", [id, user.id]);
            if (checkRes.rows.length > 0) accessCheck = true;
        }

        if (!accessCheck) {
            return NextResponse.json({ success: false, message: "Unauthorized or project not found" }, { status: 403 });
        }

        // Get project details
        const projectRes = await dbQuery(`
            SELECT p.*, u.name as creator_name 
            FROM internal_projects p
            LEFT JOIN users u ON p.created_by = u.user_id
            WHERE p.project_id = $1
        `, [id]);
        
        if (projectRes.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
        }
        
        const project = projectRes.rows[0];

        // Get assigned developers
        const devRes = await dbQuery(`
            SELECT u.user_id, u.name, u.email, u.role
            FROM project_assignments pa
            JOIN users u ON pa.developer_id = u.user_id
            WHERE pa.project_id = $1
        `, [id]);
        project.developers = devRes.rows;

        return NextResponse.json({ success: true, data: project });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req, { params }) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });
        
        if (auth.data.role !== 'manager' && auth.data.role !== 'admin') {
            return NextResponse.json({ success: false, message: "Only managers can edit projects" }, { status: 403 });
        }

        const { id } = await params;
        const body = await req.json();
        const { title, description, status, deadline } = body;
        
        // Build dynamic update query
        const updates = [];
        const values = [];
        let index = 1;
        
        if (title !== undefined) { updates.push(`title = $${index++}`); values.push(title); }
        if (description !== undefined) { updates.push(`description = $${index++}`); values.push(description); }
        if (status !== undefined) { updates.push(`status = $${index++}`); values.push(status); }
        if (deadline !== undefined) { updates.push(`deadline = $${index++}`); values.push(deadline); }
        
        if (updates.length === 0) {
            return NextResponse.json({ success: false, message: "No fields to update" }, { status: 400 });
        }
        
        values.push(id);
        const query = `
            UPDATE internal_projects 
            SET ${updates.join(', ')} 
            WHERE project_id = $${index} 
            RETURNING *
        `;
        
        const res = await dbQuery(query, values);
        
        if (res.rows.length === 0) {
             return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: res.rows[0], message: "Project updated" });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
