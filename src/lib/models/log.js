
import mongoose, { Schema } from "mongoose";


const logSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { 
        type: String, 
        enum: ["create", "update", "delete", "login", "logout"], 
        required: true 
    },
    targetType: {
        type: String,
        enum: ["package", "project", "membership", "offer", "purchase", "task", "support", "ticket", "user", "blog"],
        required: true
    },
    targetId: { type: Schema.Types.ObjectId, required: false }, 
    description: { type: String, required: true },
    metadata: { type: Object, default: {} },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });


logSchema.index({ userId: 1 });
logSchema.index({ targetType: 1 });
logSchema.index({ createdAt: -1 });
logSchema.index({ action: 1 });

export const Log = mongoose.models.Log || mongoose.model('Log', logSchema);
export default Log;
