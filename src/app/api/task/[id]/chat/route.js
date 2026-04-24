import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/database/pg';
import { isLogin } from '@/lib/middleware';

export async function GET(req, { params }) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const taskId = params.id;
        const user = auth.data;

        // Verify task access
        const taskCheck = await dbQuery("SELECT assigned_to, created_by FROM tasks WHERE task_id = $1", [taskId]);
        if (taskCheck.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Task not found" }, { status: 404 });
        }

        const task = taskCheck.rows[0];
        if (user.role !== 'admin' && user.role !== 'manager' && task.assigned_to !== user.id) {
            return NextResponse.json({ success: false, message: "Unauthorized access to task chat" }, { status: 403 });
        }

        const res = await dbQuery(`
            SELECT m.*, u.name as sender_name, u.role as sender_role 
            FROM task_messages m
            JOIN users u ON m.user_id = u.user_id
            WHERE m.task_id = $1
            ORDER BY m.created_at ASC
        `, [taskId]);
        
        return NextResponse.json({ success: true, data: res.rows });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req, { params }) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const taskId = params.id;
        const { message } = await req.json();
        if (!message) return NextResponse.json({ success: false, message: "Message is required" }, { status: 400 });

        const user = auth.data;

        // Verify task access
        const taskCheck = await dbQuery("SELECT assigned_to, created_by FROM tasks WHERE task_id = $1", [taskId]);
        if (taskCheck.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Task not found" }, { status: 404 });
        }

        const task = taskCheck.rows[0];
        if (user.role !== 'admin' && user.role !== 'manager' && task.assigned_to !== user.id) {
            return NextResponse.json({ success: false, message: "Unauthorized access to task chat" }, { status: 403 });
        }

        const res = await dbQuery(`
            INSERT INTO task_messages (task_id, user_id, message)
            VALUES ($1, $2, $3)
            RETURNING *
        `, [taskId, user.id, message]);

        // Fetch sender details to return with the new message
        const senderCheck = await dbQuery("SELECT name, role FROM users WHERE user_id = $1", [user.id]);
        const newMessage = {
            ...res.rows[0],
            sender_name: senderCheck.rows[0].name,
            sender_role: senderCheck.rows[0].role
        };

        return NextResponse.json({ success: true, message: 'Message sent', data: newMessage });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
