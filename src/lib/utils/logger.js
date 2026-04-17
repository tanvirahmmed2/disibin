import connectDB from "@/lib/database/db";
import { Log } from "@/lib/models/log";

/**
 * Creates a new activity log entry.
 * 
 * @param {Object} params
 * @param {string} params.userId - ID of the user performing the action
 * @param {string} params.action - Type of action (create, update, delete)
 * @param {string} params.targetType - Type of resource being acted upon
 * @param {string} [params.targetId] - ID of the resource (optional)
 * @param {string} params.description - Human-readable description
 * @param {Object} [params.metadata] - Additional JSON metadata (optional)
 */
export async function createLog({ userId, action, targetType, targetId, description, metadata = {} }) {
    try {
        await connectDB();
        
        if (!userId || !action || !targetType || !description) {
            console.error("Missing required fields for logging:", { userId, action, targetType, description });
            return null;
        }

        const logEntry = await Log.create({
            userId,
            action,
            targetType,
            targetId: targetId || null,
            description,
            metadata
        });

        return logEntry;
    } catch (error) {
        // We log the error but don't throw it to avoid breaking the main operation if logging fails
        console.error("Critical: Failed to create activity log:", error.message);
        return null;
    }
}
