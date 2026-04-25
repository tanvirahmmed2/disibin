import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/database/pg';
import { isLogin, isManager, isDeveloper } from '@/lib/middleware';
import { createLog } from '@/lib/utils/logger';

export async function GET(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const user = auth.data;

        let sql = `
            SELECT t.*, u.name as assigned_to_name, c.name as created_by_name
            FROM tasks t
            LEFT JOIN users u ON t.assigned_to = u.user_id
            LEFT JOIN users c ON t.created_by = c.user_id
            WHERE 1=1
        `;
        const params = [];

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

        const validPriorities = ['low', 'medium', 'high', 'urgent'];
        const taskPriority = validPriorities.includes(priority) ? priority : 'medium';

        const user = auth.data;

        const res = await dbQuery(`
            INSERT INTO tasks (title, description, assigned_to, created_by, status, priority, due_date)
            VALUES ($1, $2, $3, $4, 'pending', $5, $6)
            RETURNING *
        `, [title, description, assignedTo || null, user.id, taskPriority, dueDate || null]);

        const task = res.rows[0];

        if (task.assigned_to) {
            await createLog({
                userId: user.id,
                action: 'assign',
                targetType: 'task',
                targetId: task.task_id,
                description: `Assigned task "${task.title}" to user ID ${task.assigned_to}`
            });
        }

        return NextResponse.json({ success: true, message: 'Task created', data: task });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const { id, status, priority, description, assignedTo, dueDate } = await req.json();
        if (!id) return NextResponse.json({ success: false, message: "Task ID required" }, { status: 400 });

        const user = auth.data;

        const validStatuses = ['pending', 'in_progress', 'in_review', 'completed'];
        const validPriorities = ['low', 'medium', 'high', 'urgent'];

        let updateFields = [];
        let params = [];

        if (status && validStatuses.includes(status)) {
            params.push(status);
            updateFields.push(`status = $${params.length}`);
        }

        // Managers can update everything
        if (user.role === 'manager' || user.role === 'admin') {
            if (priority && validPriorities.includes(priority)) {
                params.push(priority);
                updateFields.push(`priority = $${params.length}`);
            }
            if (description !== undefined) {
                params.push(description);
                updateFields.push(`description = $${updateParams?.length || params.length}`); // Fixed typo from previous logic if any
                updateFields.pop(); // Remove above and redo correctly
                updateFields.push(`description = $${params.length}`);
            }
            if (assignedTo !== undefined) {
                params.push(assignedTo || null);
                updateFields.push(`assigned_to = $${params.length}`);
            }
            if (dueDate !== undefined) {
                params.push(dueDate || null);
                updateFields.push(`due_date = $${params.length}`);
            }
        } else if (user.role === 'developer') {
            // Developers can only update status
            const checkTask = await dbQuery("SELECT assigned_to FROM tasks WHERE task_id = $1", [id]);
            if (checkTask.rows.length === 0 || checkTask.rows[0].assigned_to !== user.id) {
                return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
            }
        } else {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        if (updateFields.length === 0 && !status) { // Ensure at least one update or status change
            return NextResponse.json({ success: false, message: "No fields to update" }, { status: 400 });
        }

        updateFields.push(`updated_at = NOW()`);
        params.push(id);
        
        let sql = `UPDATE tasks SET ${updateFields.join(', ')} WHERE task_id = $${params.length} RETURNING *`;
        
        const res = await dbQuery(sql, params);
        if (res.rows.length === 0) return NextResponse.json({ success: false, message: "Task not found" }, { status: 404 });

        const updatedTask = res.rows[0];

        if (assignedTo !== undefined) {
            await createLog({
                userId: user.id,
                action: 'assign',
                targetType: 'task',
                targetId: updatedTask.task_id,
                description: assignedTo ? `Assigned task "${updatedTask.title}" to user ID ${assignedTo}` : `Unassigned task "${updatedTask.title}"`
            });
        }

        return NextResponse.json({ success: true, message: 'Task updated', data: updatedTask });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const { id } = await req.json();
        if (!id) return NextResponse.json({ success: false, message: "Task ID required" }, { status: 400 });

        const res = await dbQuery("DELETE FROM tasks WHERE task_id = $1 RETURNING *", [id]);
        if (res.rows.length === 0) return NextResponse.json({ success: false, message: "Task not found" }, { status: 404 });

        return NextResponse.json({ success: true, message: 'Task deleted successfully' });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
