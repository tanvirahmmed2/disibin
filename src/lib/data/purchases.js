import { dbQuery } from "../database/pg";

export async function getPurchases() {
    const query = `
        SELECT p.*, u.name as user_name, u.email as user_email,
               a.name as approved_by_name
        FROM purchases p
        LEFT JOIN users u ON p.user_id = u.user_id
        LEFT JOIN users a ON p.approved_by = a.user_id
        ORDER BY p.created_at DESC
    `;
    const res = await dbQuery(query);
    return res.rows;
}

export async function updatePurchaseStatus(id, status, approvedBy = null, reason = null) {
    const query = `
        UPDATE purchases 
        SET status = $1, 
            approved_by = $2, 
            approved_at = CASE WHEN $1 = 'approved' THEN now() ELSE approved_at END,
            rejected_reason = $3,
            updated_at = now() 
        WHERE purchase_id = $4 
        RETURNING *
    `;
    const res = await dbQuery(query, [status, approvedBy, reason, id]);
    return res.rows[0];
}
