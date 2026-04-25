import { NextResponse } from 'next/server';
import { dbQuery, transaction } from '@/lib/database/pg';
import { isLogin, isSupport, isManager } from '@/lib/middleware';
import { createLog } from '@/lib/utils/logger';

export async function GET(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const user = auth.data;
        const tenantId = user.tenantId;
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');
        const personal = searchParams.get('personal');

        let sql = `
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
            WHERE 1=1
        `;
        const params = [];

        if (user.role === 'user' || personal === 'true') {
            params.push(user.id);
            sql += ` AND t.user_id = $${params.length}`;
        } else if (user.role === 'manager') {
            params.push(user.id);
            sql += ` AND t.assigned_to = $${params.length}`;
        }

        if (status) {
            params.push(status);
            sql += ` AND t.status = $${params.length}`;
        }

        sql += " ORDER BY t.updated_at DESC";

        const res = await dbQuery(sql, params);
        return NextResponse.json({ success: true, message: 'Tickets fetched', data: res.rows });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const { subject, message, priority } = await req.json();
        if (!subject || !message) return NextResponse.json({ success: false, message: 'Subject and message are required' }, { status: 400 });

        const user = auth.data;

        const validPriorities = ['low', 'medium', 'high', 'urgent'];
        const taskPriority = validPriorities.includes(priority) ? priority : 'medium';

        const result = await transaction(async (client) => {
            const ticketRes = await client.query(`
                INSERT INTO tickets (user_id, subject, message, status, priority)
                VALUES ($1, $2, $3, 'open', $4)
                RETURNING *
            `, [user.id, subject, message, taskPriority]);
            
            const ticket = ticketRes.rows[0];

            await client.query(`
                INSERT INTO ticket_messages (ticket_id, user_id, message)
                VALUES ($1, $2, $3)
            `, [ticket.ticket_id, user.id, message]);

            return ticket;
        });

        // Log ticket creation
        await createLog({
            userId: user.id,
            action: 'create',
            targetType: 'ticket',
            targetId: result.ticket_id,
            description: `Opened a new ticket: ${subject}`
        });

        return NextResponse.json({ success: true, message: 'Ticket created', data: result });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const { id, status, assignedId, priority, message } = await req.json();
        if (!id) return NextResponse.json({ success: false, message: 'Ticket ID required' }, { status: 400 });

        const user = auth.data;

        const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
        const validPriorities = ['low', 'medium', 'high', 'urgent'];

        const result = await transaction(async (client) => {
            const ticketCheck = await client.query(`
                SELECT * FROM tickets WHERE ticket_id = $1
            `, [id]);
            if (ticketCheck.rows.length === 0) throw new Error("Ticket not found");

            const isStaff = ['admin', 'manager', 'support'].includes(user.role);
            if (!isStaff && String(ticketCheck.rows[0].user_id) !== String(user.id)) {
                throw new Error("Unauthorized access to this ticket");
            }

            const updateFields = [];
            const updateParams = [];

            if (isStaff) {
                if (status && validStatuses.includes(status)) {
                    updateParams.push(status);
                    updateFields.push(`status = $${updateParams.length}`);
                }
                if (assignedId !== undefined) {
                    updateParams.push(assignedId === '' ? null : assignedId);
                    updateFields.push(`assigned_to = $${updateParams.length}`);
                }
                if (priority && validPriorities.includes(priority)) {
                    updateParams.push(priority);
                    updateFields.push(`priority = $${updateParams.length}`);
                }
            } else {
                if (status && (status === 'closed' || status === 'resolved')) {
                    updateParams.push(status);
                    updateFields.push(`status = $${updateParams.length}`);
                }
            }

            let updatedTicket = ticketCheck.rows[0];
            if (updateFields.length > 0) {
                updateParams.push(id);
                const sql = `UPDATE tickets SET ${updateFields.join(', ')}, updated_at = NOW() WHERE ticket_id = $${updateParams.length} RETURNING *`;
                const updatedRes = await client.query(sql, updateParams);
                updatedTicket = updatedRes.rows[0];
            }

            if (message) {
                await client.query(`
                    INSERT INTO ticket_messages (ticket_id, user_id, message)
                    VALUES ($1, $2, $3)
                `, [id, user.id, message]);
                await client.query("UPDATE tickets SET updated_at = NOW() WHERE ticket_id = $1", [id]);

                // Log support message creation
                await createLog({
                    userId: user.id,
                    action: 'create',
                    targetType: 'ticket_message',
                    targetId: id,
                    description: `Sent a message on ticket ID ${id}`
                });
            }

            return updatedTicket;
        });

        return NextResponse.json({ success: true, message: 'Ticket updated', data: result });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
