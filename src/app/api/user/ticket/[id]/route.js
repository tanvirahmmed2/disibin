import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isUserLogin } from "@/lib/auth/user";

// GET — Fetch thread for a specific user ticket
export async function GET(req, { params }) {
    try {
        const auth = await isUserLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const userId = auth.data.id;
        const resolvedParams = await params;
        const ticketId = resolvedParams.id;

        // Check if user is participant
        const partRes = await dbQuery(
            `SELECT id FROM ticket_participants WHERE ticket_id = $1 AND user_id = $2`,
            [ticketId, userId]
        );
        if (partRes.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Ticket not found or access denied" }, { status: 404 });
        }

        // Fetch ticket details
        const ticketRes = await dbQuery(
            `SELECT id, title, created_at, updated_at FROM tickets WHERE id = $1`,
            [ticketId]
        );
        const ticket = ticketRes.rows[0];

        // Fetch messages with sender names
        const messagesRes = await dbQuery(
            `SELECT 
                tm.id, 
                tm.ticket_id, 
                tm.user_id, 
                tm.team_id, 
                tm.message, 
                tm.created_at,
                u.name AS user_name,
                t.name AS team_name,
                t.role AS team_role
             FROM ticket_messages tm
             LEFT JOIN users u ON tm.user_id = u.id
             LEFT JOIN teams t ON tm.team_id = t.id
             WHERE tm.ticket_id = $1
             ORDER BY tm.created_at ASC`,
            [ticketId]
        );

        // Fetch attachments
        const attachmentsRes = await dbQuery(
            `SELECT id, ticket_id, user_id, team_id, message_id, file_url, file_id, created_at
             FROM ticket_attachments
             WHERE ticket_id = $1
             ORDER BY created_at ASC`,
            [ticketId]
        );

        // Mark last_read_at
        await dbQuery(
            `UPDATE ticket_participants SET last_read_at = now() WHERE ticket_id = $1 AND user_id = $2`,
            [ticketId, userId]
        );

        return NextResponse.json({
            success: true,
            data: {
                ticket,
                messages: messagesRes.rows,
                attachments: attachmentsRes.rows
            }
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST — Send a message / attachment to ticket
export async function POST(req, { params }) {
    try {
        const auth = await isUserLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const userId = auth.data.id;
        const resolvedParams = await params;
        const ticketId = resolvedParams.id;
        const body = await req.json();
        const { message, images } = body;

        // Check if user is participant
        const partRes = await dbQuery(
            `SELECT id FROM ticket_participants WHERE ticket_id = $1 AND user_id = $2`,
            [ticketId, userId]
        );
        if (partRes.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Ticket not found or access denied" }, { status: 404 });
        }

        const msgText = (message || "").trim();
        const hasImages = Array.isArray(images) && images.length > 0;

        if (!msgText && !hasImages) {
            return NextResponse.json({ success: false, message: "Cannot send empty message" }, { status: 400 });
        }

        // msgText may be empty when only images are sent — we'll insert a placeholder row

        let newMessage = null;

        // Always create a message row (empty string if image-only) to anchor attachments
        const msgRes = await dbQuery(
            `INSERT INTO ticket_messages (ticket_id, user_id, message) 
             VALUES ($1, $2, $3) 
             RETURNING id, ticket_id, user_id, message, created_at`,
            [ticketId, userId, msgText]
        );
        newMessage = { ...msgRes.rows[0], user_name: auth.data.name || "You" };
        const parentMessageId = msgRes.rows[0].id;

        const newAttachments = [];
        if (hasImages) {
            for (const img of images) {
                if (img.file_url) {
                    const attRes = await dbQuery(
                        `INSERT INTO ticket_attachments (ticket_id, user_id, message_id, file_url, file_id) 
                         VALUES ($1, $2, $3, $4, $5) 
                         RETURNING id, ticket_id, user_id, message_id, file_url, file_id, created_at`,
                        [ticketId, userId, parentMessageId, img.file_url, img.file_id || null]
                    );
                    newAttachments.push(attRes.rows[0]);
                }
            }
        }

        // Update ticket modified time
        await dbQuery(`UPDATE tickets SET updated_at = now() WHERE id = $1`, [ticketId]);

        return NextResponse.json({
            success: true,
            message: "Message sent",
            data: {
                newMessage,
                newAttachments
            }
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
