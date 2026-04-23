import { NextResponse } from "next/server";
import { dbQuery, transaction } from "@/lib/database/pg";
import { isLogin } from "@/lib/middleware";

const allowedChatRoles = ['admin', 'manager', 'support', 'developer'];

export async function GET(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const user = auth.data;
        if (!allowedChatRoles.includes(user.role)) {
            return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const conversationId = searchParams.get('conversationId');

        if (conversationId) {
            // Verify participant
            const convCheck = await dbQuery(`
                SELECT cp.conversation_id 
                FROM conversation_participants cp
                WHERE cp.conversation_id = $1 AND cp.user_id = $2
            `, [conversationId, user.id]);

            if (convCheck.rows.length === 0) return NextResponse.json({ success: false, message: "Conversation not found or access denied" }, { status: 404 });

            const res = await dbQuery(`
                SELECT m.*, u.name as sender_name 
                FROM chat_messages m
                JOIN users u ON m.sender_id = u.user_id
                WHERE m.conversation_id = $1
                ORDER BY m.created_at ASC
            `, [conversationId]);

            return NextResponse.json({ success: true, data: res.rows });
        }

        // List user's conversations
        const res = await dbQuery(`
            SELECT c.*, 
                   (SELECT content FROM chat_messages WHERE conversation_id = c.conversation_id ORDER BY created_at DESC LIMIT 1) as last_message
            FROM conversations c
            JOIN conversation_participants cp ON c.conversation_id = cp.conversation_id
            WHERE cp.user_id = $1
            ORDER BY c.updated_at DESC
        `, [user.id]);

        return NextResponse.json({ success: true, data: res.rows });

    } catch (error) {
        console.error("GET /api/messages error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const user = auth.data;
        if (!allowedChatRoles.includes(user.role)) {
            return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
        }

        const { receiverId, message, conversationId } = await req.json();
        if (!message) return NextResponse.json({ success: false, message: "Message content required" }, { status: 400 });

        const tenantId = user.tenantId;

        const result = await transaction(async (client) => {
            let activeConvId = conversationId;

            if (!activeConvId) {
                if (!receiverId) throw new Error("Receiver ID or Conversation ID required");

                // Create new conversation
                const newConv = await client.query(`
                    INSERT INTO conversations (title, is_group)
                    VALUES ($1, false)
                    RETURNING conversation_id
                `, ['Direct Message']);
                activeConvId = newConv.rows[0].conversation_id;

                await client.query(`
                    INSERT INTO conversation_participants (conversation_id, user_id)
                    VALUES ($1, $2), ($1, $3)
                `, [activeConvId, user.id, receiverId]);
            }

            // Insert message
            const msgRes = await client.query(`
                INSERT INTO chat_messages (conversation_id, sender_id, content)
                VALUES ($1, $2, $3)
                RETURNING *
            `, [activeConvId, user.id, message]);

            await client.query("UPDATE conversations SET updated_at = NOW() WHERE conversation_id = $1", [activeConvId]);

            return msgRes.rows[0];
        });

        return NextResponse.json({ success: true, message: 'Message sent', data: result });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
