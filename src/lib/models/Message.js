import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Optional for group chats
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    message: {
        type: String,
        required: true,
        trim: true
    },
    attachments: [{
        url: String,
        name: String,
        type: String
    }],
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Index for faster queries
messageSchema.index({ senderId: 1, receiverId: 1 });
messageSchema.index({ participants: 1 });

export const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);
export default Message;
