import { NextResponse } from "next/server";
import { isLogin, hasRole } from "@/lib/middleware";
import { dbQuery } from "@/lib/database/pg";

const STAFF_ROLES = ['admin', 'manager', 'support'];

// GET ticket details + messages
export async function GET(req, { params }) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const { id: ticketId } = await params;
        
        const ticketRes = await dbQuery(`
            SELECT t.*, u.name as user_name, a.name as assigned_name
            FROM tickets t
            LEFT JOIN users u ON t.user_id = u.user_id
            LEFT JOIN users a ON t.assigned_to = a.user_id
            WHERE t.ticket_id = $1
        `, [ticketId]);

        if (ticketRes.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Ticket not found" }, { status: 404 });
        }

        const messagesRes = await dbQuery(`
            SELECT tm.*, u.name as user_name, u.role as user_role
            FROM ticket_messages tm
            LEFT JOIN users u ON tm.user_id = u.user_id
            WHERE tm.ticket_id = $1
            ORDER BY tm.created_at ASC
        `, [ticketId]);

        const ticket = {
            ...ticketRes.rows[0],
            messages: messagesRes.rows
        };

        // Regular users can only view their own ticket
        if (auth.data.role === 'user' && ticket.user_id !== auth.data.id) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        return NextResponse.json({ success: true, data: ticket });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PATCH update ticket status or assign to manager (staff only)
export async function PATCH(req, { params }) {
    try {
        const auth = await hasRole(STAFF_ROLES);
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { id: ticketId } = await params;
        const { status, assigned_to } = await req.json();

        let result;

        if (assigned_to !== undefined) {
            const query = `
                UPDATE tickets 
                SET assigned_to = $1, status = 'in_progress'
                WHERE ticket_id = $2 
                RETURNING *
            `;
            const res = await dbQuery(query, [assigned_to, ticketId]);
            result = res.rows[0];
        } else if (status) {
            const query = `
                UPDATE tickets 
                SET status = $1 
                WHERE ticket_id = $2 
                RETURNING *
            `;
            const res = await dbQuery(query, [status, ticketId]);
            result = res.rows[0];
        } else {
            return NextResponse.json({ success: false, message: "No update data provided" }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: "Ticket updated",
            data: result
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
