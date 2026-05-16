import { dbQuery } from "../database/pg";

export async function createReview(data) {
    const { user_id, product_id, rating, comment } = data;
    const query = `
        INSERT INTO reviews (user_id, product_id, rating, comment)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;
    const res = await dbQuery(query, [user_id, product_id, rating, comment]);
    return res.rows[0];
}

export async function getPublicReviews(productId = null) {
    let query = `
        SELECT r.*, u.name as user_name, p.name as product_name
        FROM reviews r
        LEFT JOIN users u ON r.user_id = u.user_id
        LEFT JOIN products p ON r.product_id = p.product_id
        WHERE r.is_approved = true
    `;
    const params = [];
    if (productId) {
        query += " AND r.product_id = $1";
        params.push(productId);
    }
    query += " ORDER BY r.created_at DESC";

    const res = await dbQuery(query, params);
    return res.rows;
}

export async function getAllReviews() {
    const res = await dbQuery(`
        SELECT r.*, u.name as user_name, p.name as product_name
        FROM reviews r
        LEFT JOIN users u ON r.user_id = u.user_id
        LEFT JOIN products p ON r.product_id = p.product_id
        ORDER BY r.created_at DESC
    `, []);
    return res.rows;
}

export async function approveReview(reviewId, isApproved = true) {
    const res = await dbQuery(
        "UPDATE reviews SET is_approved = $1 WHERE review_id = $2 RETURNING *",
        [isApproved, reviewId]
    );
    return res.rows[0];
}
export async function replyToReview(reviewId, reply) {
    const res = await dbQuery(
        "UPDATE reviews SET reply = $1 WHERE review_id = $2 RETURNING *",
        [reply, reviewId]
    );
    return res.rows[0];
}

export async function deleteReview(reviewId) {
    const res = await dbQuery("DELETE FROM reviews WHERE review_id = $1 RETURNING *", [reviewId]);
    return res.rows[0];
}
