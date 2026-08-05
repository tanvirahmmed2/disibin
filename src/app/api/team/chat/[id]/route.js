import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isTeamLogin } from "@/lib/auth/team";

// GET — Fetch thread for a specific team chat conversation
export async function GET(req, { params }) {
    try {
        const auth = await isTeamLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const currentTeamId = auth.data.id;
        const resolvedParams = await params;
        const chatId = resolvedParams.id;

        // Check if team member is participant
        const partRes = await dbQuery(
            `SELECT id FROM chat_participants WHERE chat_id = $1 AND team_id = $2`,
            [chatId, currentTeamId]
        );
        if (partRes.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Conversation not found or access denied" }, { status: 404 });
        }

        // Fetch chat details
        const chatRes = await dbQuery(
            `SELECT id, title, is_group, created_by, created_at FROM chats WHERE id = $1`,
            [chatId]
        );
        const chat = chatRes.rows[0];

        // Fetch participants
        const participantsRes = await dbQuery(
            `SELECT tp.team_id, t.name, t.email, t.role 
             FROM chat_participants tp
             JOIN teams t ON tp.team_id = t.id
             WHERE tp.chat_id = $1`,
            [chatId]
        );

        // Fetch messages with sender details
        const messagesRes = await dbQuery(
            `SELECT 
                cm.id, 
                cm.chat_id, 
                cm.sender_id, 
                cm.content, 
                cm.created_at,
                t.name AS sender_name,
                t.role AS sender_role
             FROM chat_messages cm
             LEFT JOIN teams t ON cm.sender_id = t.id
             WHERE cm.chat_id = $1
             ORDER BY cm.created_at ASC`,
            [chatId]
        );

        // Fetch attachments
        const attachmentsRes = await dbQuery(
            `SELECT ca.id, ca.chat_id, ca.sender_id, ca.image AS file_url, ca.image_id AS file_id, ca.created_at
             FROM chat_attachments ca
             WHERE ca.chat_id = $1
             ORDER BY ca.created_at ASC`,
            [chatId]
        );

        // Mark last_read_at
        await dbQuery(
            `UPDATE chat_participants SET last_read_at = now() WHERE chat_id = $1 AND team_id = $2`,
            [chatId, currentTeamId]
        );

        return NextResponse.json({
            success: true,
            data: {
                chat,
                participants: participantsRes.rows,
                messages: messagesRes.rows,
                attachments: attachmentsRes.rows
            }
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST — Send a message and/or image attachment to chat
export async function POST(req, { params }) {
    try {
        const auth = await isTeamLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const currentTeamId = auth.data.id;
        const resolvedParams = await params;
        const chatId = resolvedParams.id;
        const body = await req.json();
        const { content, message, images } = body;

        const textContent = (content || message || "").trim();
        const hasImages = Array.isArray(images) && images.length > 0;

        if (!textContent && !hasImages) {
            return NextResponse.json({ success: false, message: "Cannot send empty message" }, { status: 400 });
        }

        // Check if team member is participant
        const partRes = await dbQuery(
            `SELECT id FROM chat_participants WHERE chat_id = $1 AND team_id = $2`,
            [chatId, currentTeamId]
        );
        if (partRes.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Conversation not found or access denied" }, { status: 404 });
        }

        let newMessage = null;
        if (textContent) {
            const msgRes = await dbQuery(
                `INSERT INTO chat_messages (chat_id, sender_id, content) 
                 VALUES ($1, $2, $3) 
                 RETURNING id, chat_id, sender_id, content, created_at`,
                [chatId, currentTeamId, textContent]
            );
            newMessage = {
                ...msgRes.rows[0],
                sender_name: auth.data.name || "Team Member",
                sender_role: auth.data.role || "staff"
            };
        }

        const newAttachments = [];
        if (hasImages) {
            for (const img of images) {
                if (img.file_url) {
                    const attRes = await dbQuery(
                        `INSERT INTO chat_attachments (chat_id, sender_id, image, image_id) 
                         VALUES ($1, $2, $3, $4) 
                         RETURNING id, chat_id, sender_id, image AS file_url, image_id AS file_id, created_at`,
                        [chatId, currentTeamId, img.file_url, img.file_id || 'att_' + Date.now()]
                    );
                    newAttachments.push(attRes.rows[0]);
                }
            }
        }

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
