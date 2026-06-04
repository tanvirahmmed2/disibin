import { NextResponse } from "next/server";
import { dbQuery, transaction } from "@/lib/database/pg";
import { isLogin } from "@/lib/middleware";

export async function GET(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });
        
        const user = auth.data;
        let query, params = [];
        
        // If manager or admin, show all projects they created (or just all internal projects)
        if (user.role === 'manager' || user.role === 'admin') {
            query = `
                SELECT p.*, u.name as creator_name,
                (SELECT COUNT(*) FROM internal_tasks WHERE project_id = p.project_id) as total_tasks,
                (SELECT COUNT(*) FROM internal_tasks WHERE project_id = p.project_id AND status = 'completed') as completed_tasks
                FROM internal_projects p
                LEFT JOIN users u ON p.created_by = u.user_id
                ORDER BY p.created_at DESC
            `;
        } else if (user.role === 'developer') {
            // Developers see projects they are assigned to
            query = `
                SELECT p.*, u.name as creator_name,
                (SELECT COUNT(*) FROM internal_tasks WHERE project_id = p.project_id AND assigned_to = $1) as my_tasks,
                (SELECT COUNT(*) FROM internal_tasks WHERE project_id = p.project_id) as total_tasks,
                (SELECT COUNT(*) FROM internal_tasks WHERE project_id = p.project_id AND status = 'completed') as completed_tasks
                FROM internal_projects p
                JOIN project_assignments pa ON pa.project_id = p.project_id
                LEFT JOIN users u ON p.created_by = u.user_id
                WHERE pa.developer_id = $1
                ORDER BY p.created_at DESC
            `;
            params = [user.id];
        } else {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        const res = await dbQuery(query, params);
        return NextResponse.json({ success: true, data: res.rows });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });
        
        if (auth.data.role !== 'manager' && auth.data.role !== 'admin') {
            return NextResponse.json({ success: false, message: "Only managers can create projects" }, { status: 403 });
        }

        const body = await req.json();
        const { title, description, deadline, assigned_developers } = body; // assigned_developers is an array of IDs

        if (!title) {
            return NextResponse.json({ success: false, message: "Title is required" }, { status: 400 });
        }

        const result = await transaction(async (client) => {
            const projectRes = await client.query(`
                INSERT INTO internal_projects (title, description, created_by, deadline)
                VALUES ($1, $2, $3, $4)
                RETURNING *
            `, [title, description || null, auth.data.id, deadline || null]);
            
            const project = projectRes.rows[0];

            if (assigned_developers && Array.isArray(assigned_developers) && assigned_developers.length > 0) {
                // Bulk insert assignments
                const values = assigned_developers.map((devId, i) => `($1, $${i + 2})`).join(', ');
                const assignParams = [project.project_id, ...assigned_developers];
                await client.query(`
                    INSERT INTO project_assignments (project_id, developer_id)
                    VALUES ${values}
                `, assignParams);
            }

            return project;
        });

        return NextResponse.json({ success: true, data: result, message: "Project created successfully" });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
