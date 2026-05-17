import { dbQuery } from "../database/pg";

export async function getInbox(userId) {
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
             (
                SELECT u2.image 
                FROM conversation_participants cp2 
                JOIN users u2 ON cp2.user_id = u2.user_id 
                WHERE cp2.conversation_id = c.conversation_id 
                AND cp2.user_id != $1 
                LIMIT 1
            ) as other_participant_image
        FROM conversations c
        JOIN conversation_participants cp ON c.conversation_id = cp.conversation_id
        LEFT JOIN latest_messages lm ON c.conversation_id = lm.conversation_id
        LEFT JOIN chat_messages cm ON c.conversation_id = cm.conversation_id AND cm.created_at = lm.latest_message_time
        LEFT JOIN users u ON cm.sender_id = u.user_id
        WHERE cp.user_id = $1
        ORDER BY COALESCE(cm.created_at, c.created_at) DESC
    `;
    const res = await dbQuery(query, [userId]);
    return res.rows;
}

export async function getConversationMessages(conversationId, userId) {
    // Ensure the user is part of the conversation
    const checkQuery = `
        SELECT 1 FROM conversation_participants 
        WHERE conversation_id = $1 AND user_id = $2
    `;
    const checkRes = await dbQuery(checkQuery, [conversationId, userId]);
    if (checkRes.rowCount === 0) {
        throw new Error("Unauthorized to access this conversation");
    }

    const query = `
        SELECT cm.*, u.name as sender_name, u.image as sender_image, u.role as sender_role
        FROM chat_messages cm
        JOIN users u ON cm.sender_id = u.user_id
        WHERE cm.conversation_id = $1
        ORDER BY cm.created_at ASC
    `;
    const res = await dbQuery(query, [conversationId]);
    return res.rows;
}

export async function createConversation(isGroup, title, createdBy, participantIds) {
    // 1. Insert into conversations
    const convQuery = `
        INSERT INTO conversations (title, is_group, created_by)
        VALUES ($1, $2, $3)
        RETURNING *
    `;
    const convRes = await dbQuery(convQuery, [title, isGroup, createdBy]);
    const conversation = convRes.rows[0];

    // 2. Insert participants
    // Ensure createdBy is in participants
    const uniqueParticipants = [...new Set([...participantIds, createdBy])];
    
    for (const userId of uniqueParticipants) {
        const partQuery = `
            INSERT INTO conversation_participants (conversation_id, user_id)
            VALUES ($1, $2)
        `;
        await dbQuery(partQuery, [conversation.conversation_id, userId]);
    }

    return conversation;
}

export async function sendMessage(conversationId, senderId, content) {
    // Ensure user is participant
    const checkQuery = `
        SELECT 1 FROM conversation_participants 
        WHERE conversation_id = $1 AND user_id = $2
    `;
    const checkRes = await dbQuery(checkQuery, [conversationId, senderId]);
    if (checkRes.rowCount === 0) {
        throw new Error("Unauthorized to access this conversation");
    }

    const msgQuery = `
        INSERT INTO chat_messages (conversation_id, sender_id, content)
        VALUES ($1, $2, $3)
        RETURNING *
    `;
    const res = await dbQuery(msgQuery, [conversationId, senderId, content]);
    
    // Update last_read_at for sender
    await markAsRead(conversationId, senderId);

    return res.rows[0];
}

export async function findExistingOneOnOne(userId1, userId2) {
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
    const res = await dbQuery(query, [userId1, userId2]);
    return res.rows[0] || null;
}

export async function markAsRead(conversationId, userId) {
    await dbQuery(
        "UPDATE conversation_participants SET last_read_at = NOW() WHERE conversation_id = $1 AND user_id = $2",
        [conversationId, userId]
    );
}

export async function getConversationDetails(conversationId) {
    const query = `SELECT * FROM conversations WHERE conversation_id = $1`;
    const res = await dbQuery(query, [conversationId]);
    return res.rows[0];
}
