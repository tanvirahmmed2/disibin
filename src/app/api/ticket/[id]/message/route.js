import { NextResponse } from "next/server";
import { isLogin } from "@/lib/middleware";
import { dbQuery } from "@/lib/database/pg";

// POST add a reply to a ticket
export async function POST(req, { params }) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const { id: ticketId } = await params;
        const userId = auth.data.id;
        const { message } = await req.json();

        if (!message) {
            return NextResponse.json({ success: false, message: "Message is required" }, { status: 400 });
        }

        // Ensure ticket exists and user is authorized
        const ticketRes = await dbQuery("SELECT user_id FROM tickets WHERE ticket_id = $1", [ticketId]);
        if (ticketRes.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Ticket not found" }, { status: 404 });
        }
        const ticket = ticketRes.rows[0];

        // Regular users can only reply to their own ticket
        if (auth.data.role === 'user' && ticket.user_id !== auth.data.id) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        const query = `
            INSERT INTO ticket_messages (ticket_id, user_id, message, attachments)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const res = await dbQuery(query, [ticketId, userId, message, JSON.stringify([])]);
        const newMessage = res.rows[0];

        return NextResponse.json({
            success: true,
            message: "Reply sent",
            data: newMessage
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
