import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/database/pg';
import { isLogin } from '@/lib/middleware';

export async function GET(req, { params }) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const user = auth.data;
        const { id } = await params;

        const res = await dbQuery(`
            SELECT t.*, u1.name as sender_name, u1.email as sender_email, 
                   u2.name as assigned_name, u2.email as assigned_email,
                   COALESCE(
                       (SELECT json_agg(json_build_object(
                           'message_id', tm.message_id, 
                           'senderId', tm.user_id, 
                           'senderRole', u3.role,
                           'senderName', u3.name,
                           'message', tm.message, 
                           'created_at', tm.created_at
                       ) ORDER BY tm.created_at ASC)
                        FROM ticket_messages tm 
                        JOIN users u3 ON tm.user_id = u3.user_id
                        WHERE tm.ticket_id = t.ticket_id),
                       '[]'::json
                   ) as messages
            FROM tickets t
            JOIN users u1 ON t.user_id = u1.user_id
            LEFT JOIN users u2 ON t.assigned_to = u2.user_id
            WHERE t.ticket_id = $1
        `, [id]);

        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: 'Ticket not found' }, { status: 404 });
        }

        const ticket = res.rows[0];

        // Enforce access: regular users can only see their own tickets
        const isStaff = ['admin', 'manager', 'support'].includes(user.role);
        if (!isStaff && String(ticket.user_id) !== String(user.id)) {
            return NextResponse.json({ success: false, message: 'Access denied' }, { status: 403 });
        }

        return NextResponse.json({ success: true, message: 'Ticket fetched', data: ticket });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
