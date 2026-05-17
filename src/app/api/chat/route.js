import { NextResponse } from "next/server";
import { hasRole } from "@/lib/middleware";
import { dbQuery } from "@/lib/database/pg";

const MANAGEMENT_ROLES = ['admin', 'manager', 'support', 'developer'];

// GET Inbox (List of conversations)
export async function GET(req) {
    try {
        const auth = await hasRole(MANAGEMENT_ROLES);
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const userId = auth.data.id;
        
        const query = `
            WITH latest_messages AS (
                SELECT 
                    conversation_id,
                    MAX(created_at) as latest_message_time
                FROM chat_messages
                GROUP BY conversation_id
            )
            SELECT 
                c.conversation_id,
                c.title,
                c.is_group,
                c.created_by,
                c.created_at,
                cp.last_read_at,
                cm.content as last_message,
                cm.created_at as last_message_time,
                cm.sender_id,
                u.name as sender_name,
                -- For 1-on-1, get the other participant's info
                (
                    SELECT u2.name 
                    FROM conversation_participants cp2 
                    JOIN users u2 ON cp2.user_id = u2.user_id 
                    WHERE cp2.conversation_id = c.conversation_id 
                    AND cp2.user_id != $1 
                    LIMIT 1
                ) as other_participant_name,
                NULL as other_participant_image
            FROM conversations c
            JOIN conversation_participants cp ON c.conversation_id = cp.conversation_id
            LEFT JOIN latest_messages lm ON c.conversation_id = lm.conversation_id
            LEFT JOIN chat_messages cm ON c.conversation_id = cm.conversation_id AND cm.created_at = lm.latest_message_time
            LEFT JOIN users u ON cm.sender_id = u.user_id
            WHERE cp.user_id = $1
            ORDER BY COALESCE(cm.created_at, c.created_at) DESC
        `;
        const res = await dbQuery(query, [userId]);

        return NextResponse.json({ success: true, data: res.rows });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST Create a new conversation (1-on-1 or group)
export async function POST(req) {
    try {
        const auth = await hasRole(MANAGEMENT_ROLES);
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const createdBy = auth.data.id;
        const { isGroup, title, participantIds } = await req.json();

        if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
            return NextResponse.json({ success: false, message: "Participants are required" }, { status: 400 });
        }

        // Check if 1-on-1 already exists
        if (!isGroup && participantIds.length === 1) {
            const query = `
                SELECT c.conversation_id
                FROM conversations c
                WHERE c.is_group = false
                AND EXISTS (
                    SELECT 1 FROM conversation_participants cp 
                    WHERE cp.conversation_id = c.conversation_id AND cp.user_id = $1
                )
                AND EXISTS (
                    SELECT 1 FROM conversation_participants cp 
                    WHERE cp.conversation_id = c.conversation_id AND cp.user_id = $2
                )
            `;
            const res = await dbQuery(query, [createdBy, participantIds[0]]);
            const existing = res.rows[0] || null;

            if (existing) {
                return NextResponse.json({
                    success: true,
                    message: "Conversation already exists",
                    data: existing
                });
            }
        }

        // Create new conversation
        const conversationTitle = isGroup ? title : null; // 1-on-1 doesn't need a specific title usually
        
        // 1. Insert into conversations
        const convQuery = `
            INSERT INTO conversations (title, is_group, created_by)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const convRes = await dbQuery(convQuery, [conversationTitle, isGroup, createdBy]);
        const conversation = convRes.rows[0];

        // 2. Insert participants
        const uniqueParticipants = [...new Set([...participantIds, createdBy])];
        
        for (const uId of uniqueParticipants) {
            const partQuery = `
                INSERT INTO conversation_participants (conversation_id, user_id)
                VALUES ($1, $2)
            `;
            await dbQuery(partQuery, [conversation.conversation_id, uId]);
        }
        
        return NextResponse.json({
            success: true,
            message: "Conversation created",
            data: conversation
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
