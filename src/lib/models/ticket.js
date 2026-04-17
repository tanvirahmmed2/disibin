import mongoose, { Schema } from "mongoose";

const ticketSchema = new Schema({
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, trim: true, required: true },
    message: { type: String, trim: true }, 
    attachment: { type: String, trim: true }, 
    
    category: { 
        type: String, 
        enum: ['general', 'project', 'billing', 'technical'], 
        default: 'general' 
    },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
    
    assignedId: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { 
        type: String, 
        enum: ['open', 'in_progress', 'closed', 'resolved'], 
        default: 'open' 
    },
    priority: { 
        type: String, 
        enum: ['low', 'medium', 'high', 'urgent'], 
        default: 'medium' 
    },
    
    messages: [
        {
            senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
            type: { type: String, enum: ["text", "file", "system"], default: "text" },
            message: String,
            attachments: [String],
            createdAt: { type: Date, default: Date.now },
        },
    ],
    
    lastMessageAt: { type: Date, default: Date.now }
}, { timestamps: true })

export const Ticket = mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema)
export default Ticket;
