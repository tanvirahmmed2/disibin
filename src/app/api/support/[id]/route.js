import { NextResponse } from "next/server";
import { isLogin, hasRole } from "@/lib/middleware";
import { dbQuery } from "@/lib/database/pg";

// GET ticket details and messages
export async function GET(req, { params }) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const { id } = await params;
        
        const ticketRes = await dbQuery(`
            SELECT t.*, u.name as user_name, a.name as assigned_name
            FROM tickets t
            LEFT JOIN users u ON t.user_id = u.user_id
            LEFT JOIN users a ON t.assigned_to = a.user_id
            WHERE t.ticket_id = $1
        `, [id]);

        if (ticketRes.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Ticket not found" }, { status: 404 });
        }

        const messagesRes = await dbQuery(`
            SELECT tm.*, u.name as user_name, u.role as user_role
            FROM ticket_messages tm
            LEFT JOIN users u ON tm.user_id = u.user_id
            WHERE tm.ticket_id = $1
            ORDER BY tm.created_at ASC
        `, [id]);

        const ticket = {
            ...ticketRes.rows[0],
            messages: messagesRes.rows
        };

        // Security: Check if user owns the ticket or is staff
        const user = auth.data;
        const isStaff = ['admin', 'support', 'manager'].includes(user.role);
        if (!isStaff && ticket.user_id !== user.id) {
            return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
        }

        return NextResponse.json({ success: true, data: ticket });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST add message (Reply)
export async function POST(req, { params }) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const { id } = await params;
        const { message, attachments } = await req.json();

        if (!message) {
            return NextResponse.json({ success: false, message: "Message is required" }, { status: 400 });
        }

        // Verify access (owner or staff)
        const ticketRes = await dbQuery("SELECT user_id FROM tickets WHERE ticket_id = $1", [id]);
        if (ticketRes.rows.length === 0) return NextResponse.json({ success: false, message: "Ticket not found" }, { status: 404 });
        const ticket = ticketRes.rows[0];

        const user = auth.data;
        const isStaff = ['admin', 'support', 'manager'].includes(user.role);
        if (!isStaff && ticket.user_id !== user.id) {
            return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
        }

        const query = `
            INSERT INTO ticket_messages (ticket_id, user_id, message, attachments)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const res = await dbQuery(query, [id, user.id, message, JSON.stringify(attachments || [])]);
        const newMessage = res.rows[0];

        return NextResponse.json({
            success: true,
            message: "Reply sent successfully",
            data: newMessage
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PATCH update status (Staff only)
export async function PATCH(req, { params }) {
    try {
        const auth = await hasRole(['admin', 'support', 'manager']);
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { id } = await params;
        const { status } = await req.json();

        if (!status) {
            return NextResponse.json({ success: false, message: "Status is required" }, { status: 400 });
        }

        const query = `
            UPDATE tickets 
            SET status = $1 
            WHERE ticket_id = $2 
            RETURNING *
        `;
        const res = await dbQuery(query, [status, id]);
        const updatedTicket = res.rows[0];
        
        return NextResponse.json({
            success: true,
            message: "Ticket updated successfully",
            data: updatedTicket
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
