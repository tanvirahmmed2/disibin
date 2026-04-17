import connectDB from "@/lib/database/db";
import { Log } from "@/lib/models/log";


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
        
        console.error("Critical: Failed to create activity log:", error.message);
        return null;
    }
}
