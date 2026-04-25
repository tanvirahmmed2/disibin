import { dbQuery } from "@/lib/database/pg";

/**
 * Creates an activity log entry in the database.
 * 
 * @param {Object} params - The log parameters.
 * @param {number} params.userId - The ID of the user performing the action.
 * @param {string} params.action - The action performed (e.g., 'create', 'update', 'delete', 'assign').
 * @param {string} params.targetType - The type of entity being acted upon (e.g., 'blog', 'package', 'project').
 * @param {number} params.targetId - The ID of the entity being acted upon.
 * @param {string} params.description - A human-readable description of the action.
 * @returns {Promise<Object|null>} The created log entry or null if it failed.
 */
export async function createLog({ userId, action, targetType, targetId, description }) {
    try {
        if (!userId || !action || !targetType || !description) {
            console.error("Missing required fields for logging:", { userId, action, targetType, description });
            return null;
        }

        const res = await dbQuery(`
            INSERT INTO logs (user_id, action, entity_type, entity_id, description)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `, [userId, action, targetType, targetId || null, description]);

        return res.rows[0];
    } catch (error) {
        console.error("Critical: Failed to create activity log:", error.message);
        return null;
    }
}
