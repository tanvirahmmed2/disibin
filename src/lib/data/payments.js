import { dbQuery } from "../database/pg";

export async function getPayments() {
    const query = `
        SELECT p.*, u.name as user_name, u.email as user_email
        FROM payments p
        LEFT JOIN users u ON p.user_id = u.user_id
        ORDER BY p.created_at DESC
    `;
    const res = await dbQuery(query);
    return res.rows;
}
