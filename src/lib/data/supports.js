import { dbQuery } from "../database/pg";

export async function createSupportRequest(data) {
    const { name, email, subject, description } = data;
    const query = `
        INSERT INTO supports (name, email, subject, description)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;
    const res = await dbQuery(query, [name, email, subject, description]);
    return res.rows[0];
}

export async function getAllSupportRequests() {
    const res = await dbQuery(`
        SELECT s.*, u.name as responder_name
        FROM supports s
        LEFT JOIN users u ON s.responded_by = u.user_id
        ORDER BY s.created_at DESC
    `, []);
    return res.rows;
}

export async function getSupportRequestById(id) {
    const res = await dbQuery("SELECT * FROM supports WHERE support_id = $1", [id]);
    return res.rows[0];
}

export async function updateSupportRequestStatus(id, responded_by) {
    const query = `
        UPDATE supports 
        SET status = 'replied', responded_by = $1
        WHERE support_id = $2
        RETURNING *
    `;
    const res = await dbQuery(query, [responded_by, id]);
    return res.rows[0];
}

export async function deleteSupportRequest(id) {
    const res = await dbQuery("DELETE FROM supports WHERE support_id = $1 RETURNING *", [id]);
    return res.rows[0];
}
