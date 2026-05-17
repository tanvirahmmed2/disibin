import { NextResponse } from "next/server";
import { hasRole } from "@/lib/middleware";
import { dbQuery } from "@/lib/database/pg";

const MANAGEMENT_ROLES = ['admin', 'manager', 'support', 'developer'];

// GET messages for a specific conversation
export async function GET(req, { params }) {
    try {
        const auth = await hasRole(MANAGEMENT_ROLES);
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const userId = auth.data.id;
        const { id: conversationId } = await params;

        // Ensure the user is part of the conversation
        const checkQuery = `
            SELECT 1 FROM conversation_participants 
            WHERE conversation_id = $1 AND user_id = $2
        `;
        const checkRes = await dbQuery(checkQuery, [conversationId, userId]);
        if (checkRes.rowCount === 0) {
            return NextResponse.json({ success: false, message: "Unauthorized to access this conversation" }, { status: 403 });
        }

        const query = `
            SELECT cm.*, u.name as sender_name, NULL as sender_image, u.role as sender_role
            FROM chat_messages cm
            JOIN users u ON cm.sender_id = u.user_id
            WHERE cm.conversation_id = $1
            ORDER BY cm.created_at ASC
        `;
        const res = await dbQuery(query, [conversationId]);
        
        // Mark conversation as read
        await dbQuery(
            "UPDATE conversation_participants SET last_read_at = NOW() WHERE conversation_id = $1 AND user_id = $2",
            [conversationId, userId]
        );

        return NextResponse.json({ success: true, data: res.rows });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST send a message to a specific conversation
export async function POST(req, { params }) {
    try {
        const auth = await hasRole(MANAGEMENT_ROLES);
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const senderId = auth.data.id;
        const { id: conversationId } = await params;
        const { content } = await req.json();

        if (!content) {
            return NextResponse.json({ success: false, message: "Message content is required" }, { status: 400 });
        }

        // Ensure user is participant
        const checkQuery = `
            SELECT 1 FROM conversation_participants 
            WHERE conversation_id = $1 AND user_id = $2
        `;
        const checkRes = await dbQuery(checkQuery, [conversationId, senderId]);
        if (checkRes.rowCount === 0) {
            return NextResponse.json({ success: false, message: "Unauthorized to access this conversation" }, { status: 403 });
        }

        const msgQuery = `
            INSERT INTO chat_messages (conversation_id, sender_id, content)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const res = await dbQuery(msgQuery, [conversationId, senderId, content]);
        
        // Update last_read_at for sender
        await dbQuery(
            "UPDATE conversation_participants SET last_read_at = NOW() WHERE conversation_id = $1 AND user_id = $2",
            [conversationId, senderId]
        );
        
        return NextResponse.json({
            success: true,
            message: "Message sent",
            data: res.rows[0]
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
