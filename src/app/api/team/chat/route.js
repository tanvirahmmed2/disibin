import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isTeamLogin } from "@/lib/auth/team";

// GET — List conversations for the logged-in team member
export async function GET() {
    try {
        const auth = await isTeamLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const currentTeamId = auth.data.id;

        const query = `
            SELECT 
                c.id,
                c.title,
                c.is_group,
                c.created_by,
                c.created_at,
                tp.last_read_at,
                (
                    SELECT content FROM chat_messages cm 
                    WHERE cm.chat_id = c.id 
                    ORDER BY cm.created_at DESC LIMIT 1
                ) AS last_message,
                (
                    SELECT created_at FROM chat_messages cm 
                    WHERE cm.chat_id = c.id 
                    ORDER BY cm.created_at DESC LIMIT 1
                ) AS last_message_time,
                (
                    SELECT cm.sender_id FROM chat_messages cm 
                    WHERE cm.chat_id = c.id 
                    ORDER BY cm.created_at DESC LIMIT 1
                ) AS last_sender_id,
                (
                    SELECT t.name FROM chat_messages cm 
                    LEFT JOIN teams t ON cm.sender_id = t.id 
                    WHERE cm.chat_id = c.id 
                    ORDER BY cm.created_at DESC LIMIT 1
                ) AS last_sender_name,
                (
                    SELECT t.name FROM chat_participants tp2 
                    JOIN teams t ON tp2.team_id = t.id 
                    WHERE tp2.chat_id = c.id AND tp2.team_id != $1 LIMIT 1
                ) AS other_participant_name,
                (
                    SELECT t.role FROM chat_participants tp2 
                    JOIN teams t ON tp2.team_id = t.id 
                    WHERE tp2.chat_id = c.id AND tp2.team_id != $1 LIMIT 1
                ) AS other_participant_role
            FROM chats c
            JOIN chat_participants tp ON c.id = tp.chat_id
            WHERE tp.team_id = $1
            ORDER BY COALESCE(
                (SELECT created_at FROM chat_messages cm WHERE cm.chat_id = c.id ORDER BY cm.created_at DESC LIMIT 1),
                c.created_at
            ) DESC
        `;

        const res = await dbQuery(query, [currentTeamId]);
        return NextResponse.json({ success: true, data: res.rows });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST — Create a new chat (1-on-1 or Group)
export async function POST(req) {
    try {
        const auth = await isTeamLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const currentTeamId = auth.data.id;
        const body = await req.json();
        const { isGroup, title, participantTeamIds } = body;

        const teamIds = Array.isArray(participantTeamIds) ? participantTeamIds.map(id => parseInt(id)).filter(Boolean) : [];

        if (teamIds.length === 0) {
            return NextResponse.json({ success: false, message: "Please select at least one team member" }, { status: 400 });
        }

        // If 1-on-1, check if direct chat between these 2 users already exists
        if (!isGroup && teamIds.length === 1) {
            const targetId = teamIds[0];
            const existingRes = await dbQuery(
                `SELECT c.id, c.title, c.is_group
                 FROM chats c
                 JOIN chat_participants tp1 ON c.id = tp1.chat_id AND tp1.team_id = $1
                 JOIN chat_participants tp2 ON c.id = tp2.chat_id AND tp2.team_id = $2
                 WHERE c.is_group = false LIMIT 1`,
                [currentTeamId, targetId]
            );

            if (existingRes.rows.length > 0) {
                return NextResponse.json({
                    success: true,
                    message: "Chat conversation existing",
                    data: existingRes.rows[0]
                });
            }
        }

        // Create new chat row
        const chatTitle = isGroup ? (title || "Group Chat").trim() : null;
        const chatRes = await dbQuery(
            `INSERT INTO chats (title, is_group, created_by) 
             VALUES ($1, $2, $3) 
             RETURNING id, title, is_group, created_by, created_at`,
            [chatTitle, Boolean(isGroup), currentTeamId]
        );
        const chat = chatRes.rows[0];

        // Add logged-in team member to chat_participants
        await dbQuery(
            `INSERT INTO chat_participants (chat_id, team_id, last_read_at) VALUES ($1, $2, now())`,
            [chat.id, currentTeamId]
        );

        // Add other selected participants
        for (const tid of teamIds) {
            if (tid !== currentTeamId) {
                await dbQuery(
                    `INSERT INTO chat_participants (chat_id, team_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
                    [chat.id, tid]
                );
            }
        }

        return NextResponse.json({
            success: true,
            message: isGroup ? "Group chat created" : "Conversation started",
            data: chat
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
