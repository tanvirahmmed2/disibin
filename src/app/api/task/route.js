import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/database/pg';
import { isLogin, isManager, isDeveloper } from '@/lib/middleware';

export async function GET(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const user = auth.data;
        const tenantId = user.tenantId;

        let sql = `
            SELECT t.*, u.name as assigned_to_name 
            FROM tasks t
            LEFT JOIN users u ON t.assigned_to = u.user_id
            WHERE t.tenant_id = $1
        `;
        const params = [tenantId];

        // Developers only see their own tasks
        if (user.role === 'developer') {
            params.push(user.id);
            sql += ` AND t.assigned_to = $${params.length}`;
        }

        sql += " ORDER BY t.created_at DESC";

        const res = await dbQuery(sql, params);
        
        return NextResponse.json({ success: true, data: res.rows });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const { title, description, assignedTo, priority, dueDate } = await req.json();
        if (!title) return NextResponse.json({ success: false, message: "Title is required" }, { status: 400 });

        const user = auth.data;

        const res = await dbQuery(`
            INSERT INTO tasks (tenant_id, title, description, assigned_to, created_by, status, priority, due_date)
            VALUES ($1, $2, $3, $4, $5, 'in_progress', $6, $7)
            RETURNING *
        `, [user.tenantId, title, description, assignedTo, user.id, priority || 'medium', dueDate]);

        return NextResponse.json({ success: true, message: 'Task created', data: res.rows[0] });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const { id, status, priority } = await req.json();
        if (!id) return NextResponse.json({ success: false, message: "Task ID required" }, { status: 400 });

        const user = auth.data;

        // Managers can update everything, Developers can only update status
        let sql;
        let params;

        if (user.role === 'manager' || user.role === 'admin') {
            sql = `UPDATE tasks SET status = COALESCE($1, status), priority = COALESCE($2, priority), updated_at = NOW() WHERE task_id = $3 AND tenant_id = $4 RETURNING *`;
            params = [status, priority, id, user.tenantId];
        } else if (user.role === 'developer') {
            sql = `UPDATE tasks SET status = $1, updated_at = NOW() WHERE task_id = $2 AND assigned_to = $3 AND tenant_id = $4 RETURNING *`;
            params = [status, id, user.id, user.tenantId];
        } else {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        const res = await dbQuery(sql, params);
        if (res.rows.length === 0) return NextResponse.json({ success: false, message: "Task not found or access denied" }, { status: 404 });

        return NextResponse.json({ success: true, message: 'Task updated', data: res.rows[0] });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
