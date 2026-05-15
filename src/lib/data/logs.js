import { dbQuery } from "../database/pg";

export async function createLog(data) {
    const { user_id, action, entity_type, entity_id, details } = data;
    const query = `
        INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details)
        VALUES ($1, $2, $3, $4, $5)
    `;
    await dbQuery(query, [user_id, action, entity_type, entity_id, JSON.stringify(details)]);
}

export async function getLogs() {
    const res = await dbQuery(`
        SELECT l.*, u.name as user_name, u.role as user_role
        FROM activity_logs l
        LEFT JOIN users u ON l.user_id = u.user_id
        ORDER BY l.created_at DESC
        LIMIT 500
    `);
    return res.rows;
}
