import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isTeamLogin } from "@/lib/auth/team";

// GET — Fetch thread for a specific ticket (Team view)
export async function GET(req, { params }) {
    try {
        const auth = await isTeamLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const teamId = auth.data.id;
        const resolvedParams = await params;
        const ticketId = resolvedParams.id;

        // Fetch ticket details
        const ticketRes = await dbQuery(
            `SELECT id, title, created_at, updated_at FROM tickets WHERE id = $1`,
            [ticketId]
        );
        if (ticketRes.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Ticket not found" }, { status: 404 });
        }
        const ticket = ticketRes.rows[0];

        // Ensure team member is added to participants
        await dbQuery(
            `INSERT INTO ticket_participants (ticket_id, team_id, last_read_at) 
             VALUES ($1, $2, now()) 
             ON CONFLICT (ticket_id, user_id, team_id) DO UPDATE SET last_read_at = now()`,
            [ticketId, teamId]
        );

        // Fetch user participant info
        const userPartRes = await dbQuery(
            `SELECT u.id, u.name, u.email 
             FROM ticket_participants tp
             JOIN users u ON tp.user_id = u.id
             WHERE tp.ticket_id = $1 LIMIT 1`,
            [ticketId]
        );
        const userInfo = userPartRes.rows[0] || null;

        // Fetch messages with sender details
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

        return NextResponse.json({
            success: true,
            data: {
                ticket,
                user: userInfo,
                messages: messagesRes.rows,
                attachments: attachmentsRes.rows
            }
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST — Team member sends reply / attachments to ticket
export async function POST(req, { params }) {
    try {
        const auth = await isTeamLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const teamId = auth.data.id;
        const resolvedParams = await params;
        const ticketId = resolvedParams.id;
        const body = await req.json();
        const { message, images } = body;

        const msgText = (message || "").trim();
        const hasImages = Array.isArray(images) && images.length > 0;

        if (!msgText && !hasImages) {
            return NextResponse.json({ success: false, message: "Cannot send empty reply" }, { status: 400 });
        }

        // Always create a message row (empty string if image-only) to anchor attachments
        const msgRes = await dbQuery(
            `INSERT INTO ticket_messages (ticket_id, team_id, message) 
             VALUES ($1, $2, $3) 
             RETURNING id, ticket_id, team_id, message, created_at`,
            [ticketId, teamId, msgText]
        );
        const newMessage = { ...msgRes.rows[0], team_name: auth.data.name || "Support Team", team_role: auth.data.role || "staff" };
        const parentMessageId = msgRes.rows[0].id;

        const newAttachments = [];
        if (hasImages) {
            for (const img of images) {
                if (img.file_url) {
                    const attRes = await dbQuery(
                        `INSERT INTO ticket_attachments (ticket_id, team_id, message_id, file_url, file_id) 
                         VALUES ($1, $2, $3, $4, $5) 
                         RETURNING id, ticket_id, team_id, message_id, file_url, file_id, created_at`,
                        [ticketId, teamId, parentMessageId, img.file_url, img.file_id || null]
                    );
                    newAttachments.push(attRes.rows[0]);
                }
            }
        }

        // Update ticket modified time
        await dbQuery(`UPDATE tickets SET updated_at = now() WHERE id = $1`, [ticketId]);

        // Send in-app notification to ticket user participant
        const userPart = await dbQuery(
            `SELECT tp.user_id, t.title 
             FROM tickets t
             JOIN ticket_participants tp ON t.id = tp.ticket_id
             WHERE t.id = $1 AND tp.user_id IS NOT NULL LIMIT 1`,
            [ticketId]
        ).catch(() => ({ rows: [] }));

        if (userPart.rows.length > 0 && userPart.rows[0].user_id) {
            const { user_id, title } = userPart.rows[0];
            await dbQuery(`
                INSERT INTO notifications (user_id, title, message, type, link)
                VALUES ($1, $2, $3, $4, $5)
            `, [
                user_id,
                "Ticket Replied 💬",
                `Support team replied to "${title || 'Support Ticket'}": "${msgText.substring(0, 80)}${msgText.length > 80 ? '...' : ''}"`,
                "ticket",
                `/user/tickets/${ticketId}`
            ]).catch((err) => console.error("Ticket notification insertion failed:", err));
        }

        return NextResponse.json({
            success: true,
            message: "Reply sent successfully",
            data: {
                newMessage,
                newAttachments
            }
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
