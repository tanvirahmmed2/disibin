import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isUserLogin } from "@/lib/auth/user";

// GET — List user's tickets
export async function GET() {
    try {
        const auth = await isUserLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const userId = auth.data.id;

        const query = `
            SELECT 
                t.id, 
                t.title, 
                t.created_at, 
                t.updated_at,
                tp.last_read_at,
                (
                    SELECT message FROM ticket_messages tm 
                    WHERE tm.ticket_id = t.id 
                    ORDER BY tm.created_at DESC LIMIT 1
                ) AS last_message,
                (
                    SELECT created_at FROM ticket_messages tm 
                    WHERE tm.ticket_id = t.id 
                    ORDER BY tm.created_at DESC LIMIT 1
                ) AS last_message_at,
                (
                    SELECT COUNT(*) FROM ticket_attachments ta 
                    WHERE ta.ticket_id = t.id
                ) AS attachment_count
            FROM tickets t
            JOIN ticket_participants tp ON t.id = tp.ticket_id
            WHERE tp.user_id = $1
            ORDER BY t.updated_at DESC
        `;

        const res = await dbQuery(query, [userId]);
        return NextResponse.json({ success: true, data: res.rows });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST — Create new ticket by user
export async function POST(req) {
    try {
        const auth = await isUserLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const userId = auth.data.id;
        const body = await req.json();
        const { title, subject, message, images } = body;

        const ticketTitle = (title || subject || "").trim();
        if (!ticketTitle) {
            return NextResponse.json({ success: false, message: "Ticket subject is required" }, { status: 400 });
        }
        if (!message || !message.trim()) {
            return NextResponse.json({ success: false, message: "Initial message is required" }, { status: 400 });
        }

        // 1. Insert Ticket
        const ticketRes = await dbQuery(
            `INSERT INTO tickets (title) VALUES ($1) RETURNING id, title, created_at, updated_at`,
            [ticketTitle]
        );
        const ticket = ticketRes.rows[0];

        // 2. Add User as Participant
        await dbQuery(
            `INSERT INTO ticket_participants (ticket_id, user_id, last_read_at) VALUES ($1, $2, now())`,
            [ticket.id, userId]
        );

        // 3. Insert Initial Message
        const msgRes = await dbQuery(
            `INSERT INTO ticket_messages (ticket_id, user_id, message) VALUES ($1, $2, $3) RETURNING id, ticket_id, user_id, message, created_at`,
            [ticket.id, userId, message.trim()]
        );
        const initialMsg = msgRes.rows[0];

        // 4. Attachments (if provided)
        const attachments = [];
        if (Array.isArray(images) && images.length > 0) {
            for (const img of images) {
                if (img.file_url) {
                    const attRes = await dbQuery(
                        `INSERT INTO ticket_attachments (ticket_id, user_id, file_url, file_id) VALUES ($1, $2, $3, $4) RETURNING id, ticket_id, user_id, file_url, file_id, created_at`,
                        [ticket.id, userId, img.file_url, img.file_id || null]
                    );
                    attachments.push(attRes.rows[0]);
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: "Ticket created successfully",
            data: {
                ticket,
                message: initialMsg,
                attachments
            }
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
