import { dbQuery } from "../database/pg";
import { createLog } from "./logs";

// Create a review
export async function createReview(data) {
    const { user_id, rating, comment } = data;
    
    // Schema enforces user_id is UNIQUE, so this will throw if they already have one.
    // We can also check manually to provide a better error message.
    const checkRes = await dbQuery("SELECT review_id FROM reviews WHERE user_id = $1", [user_id]);
    if (checkRes.rows.length > 0) {
        throw new Error("You have already submitted a review.");
    }

    const res = await dbQuery(`
        INSERT INTO reviews (user_id, rating, comment)
        VALUES ($1, $2, $3)
        RETURNING *
    `, [user_id, rating, comment]);

    const review = res.rows[0];

    await createLog({
        user_id,
        action: 'CREATE',
        entity_type: 'review',
        entity_id: review.review_id,
        details: { rating, comment }
    });

    return review;
}

// Get review by user
export async function getReviewByUser(userId) {
    const res = await dbQuery(`
        SELECT r.*
        FROM reviews r
        WHERE r.user_id = $1
    `, [userId]);
    return res.rows.length > 0 ? res.rows[0] : null;
}

// Get all reviews (for manager panel)
export async function getAllReviews() {
    const res = await dbQuery(`
        SELECT r.*, 
               u.name as user_name, u.email as user_email
        FROM reviews r
        JOIN users u ON r.user_id = u.user_id
        ORDER BY r.created_at DESC
    `, []);
    return res.rows;
}

// Approve or reject a review
export async function approveReview(id, isApproved, managerId) {
    const res = await dbQuery(`
        UPDATE reviews
        SET is_approved = $1
        WHERE review_id = $2
        RETURNING *
    `, [isApproved, id]);

    const review = res.rows[0];

    if (review && managerId) {
        await createLog({
            user_id: managerId,
            action: isApproved ? 'APPROVE' : 'REJECT',
            entity_type: 'review',
            entity_id: id,
            details: { review_id: id }
        });
    }

    return review;
}

// Delete a review
export async function deleteReview(id, userId) {
    const res = await dbQuery("DELETE FROM reviews WHERE review_id = $1 RETURNING *", [id]);
    const review = res.rows[0];

    if (review && userId) {
        await createLog({
            user_id: userId,
            action: 'DELETE',
            entity_type: 'review',
            entity_id: id,
            details: { review_id: id }
        });
    }

    return review;
}
