import { dbQuery } from "../database/pg";

export async function sendInternalMessage(senderId, receiverId, message) {
    const query = `
        INSERT INTO internal_messages (sender_id, receiver_id, message)
        VALUES ($1, $2, $3)
        RETURNING *
    `;
    const res = await dbQuery(query, [senderId, receiverId, message]);
    return res.rows[0];
}

export async function getConversation(user1Id, user2Id) {
    const query = `
        SELECT im.*, s.name as sender_name, r.name as receiver_name
        FROM internal_messages im
        JOIN users s ON im.sender_id = s.user_id
        JOIN users r ON im.receiver_id = r.user_id
        WHERE (sender_id = $1 AND receiver_id = $2)
           OR (sender_id = $2 AND receiver_id = $1)
        ORDER BY created_at ASC
    `;
    const res = await dbQuery(query, [user1Id, user2Id]);
    return res.rows;
}

export async function getInbox(userId) {
    const query = `
        WITH last_messages AS (
            SELECT 
                CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END as other_user_id,
                MAX(created_at) as last_date
            FROM internal_messages
            WHERE sender_id = $1 OR receiver_id = $1
            GROUP BY other_user_id
        )
        SELECT 
            lm.other_user_id, 
            u.name as other_user_name, 
            u.role as other_user_role,
            im.message as last_message, 
            im.created_at,
            im.sender_id,
            im.is_read
        FROM last_messages lm
        JOIN users u ON lm.other_user_id = u.user_id
        JOIN internal_messages im ON (
            (im.sender_id = $1 AND im.receiver_id = lm.other_user_id) OR
            (im.sender_id = lm.other_user_id AND im.receiver_id = $1)
        ) AND im.created_at = lm.last_date
        ORDER BY im.created_at DESC
    `;
    const res = await dbQuery(query, [userId]);
    return res.rows;
}

export async function markAsRead(receiverId, senderId) {
    await dbQuery(
        "UPDATE internal_messages SET is_read = TRUE WHERE receiver_id = $1 AND sender_id = $2",
        [receiverId, senderId]
    );
}
