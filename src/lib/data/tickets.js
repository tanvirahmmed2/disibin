import { dbQuery, transaction } from "../database/pg";

export async function createTicket(data) {
    const { user_id, subject, message, priority = 'medium' } = data;
    const query = `
        INSERT INTO tickets (user_id, subject, message, priority)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;
    const res = await dbQuery(query, [user_id, subject, message, priority]);
    return res.rows[0];
}

export async function getTicketsByUser(userId) {
    const res = await dbQuery(`
        SELECT * FROM tickets 
        WHERE user_id = $1 
        ORDER BY created_at DESC
    `, [userId]);
    return res.rows;
}

export async function getAllTickets() {
    const res = await dbQuery(`
        SELECT t.*, u.name as user_name, u.email as user_email, a.name as assigned_name
        FROM tickets t
        LEFT JOIN users u ON t.user_id = u.user_id
        LEFT JOIN users a ON t.assigned_to = a.user_id
        ORDER BY t.created_at DESC
    `, []);
    return res.rows;
}

export async function getTicketDetails(ticketId) {
    const ticketRes = await dbQuery(`
        SELECT t.*, u.name as user_name, a.name as assigned_name
        FROM tickets t
        LEFT JOIN users u ON t.user_id = u.user_id
        LEFT JOIN users a ON t.assigned_to = a.user_id
        WHERE t.ticket_id = $1
    `, [ticketId]);

    if (ticketRes.rows.length === 0) return null;

    const messagesRes = await dbQuery(`
        SELECT tm.*, u.name as user_name, u.role as user_role
        FROM ticket_messages tm
        LEFT JOIN users u ON tm.user_id = u.user_id
        WHERE tm.ticket_id = $1
        ORDER BY tm.created_at ASC
    `, [ticketId]);

    return {
        ...ticketRes.rows[0],
        messages: messagesRes.rows
    };
}

export async function addTicketMessage(data) {
    const { ticket_id, user_id, message, attachments = [] } = data;
    const query = `
        INSERT INTO ticket_messages (ticket_id, user_id, message, attachments)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;
    const res = await dbQuery(query, [ticket_id, user_id, message, JSON.stringify(attachments)]);
    return res.rows[0];
}

export async function updateTicketStatus(ticketId, status, assignedTo = null) {
    let query = "UPDATE tickets SET status = $1";
    let params = [status];

    if (assignedTo) {
        query += ", assigned_to = $2";
        params.push(assignedTo);
    }

    query += ", created_at = created_at WHERE ticket_id = $" + (params.length + 1) + " RETURNING *";
    params.push(ticketId);

    const res = await dbQuery(query, params);
    return res.rows[0];
}
