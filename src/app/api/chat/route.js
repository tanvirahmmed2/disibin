import { NextResponse } from "next/server";
import { hasRole } from "@/lib/middleware";
import { getInbox, sendInternalMessage, getConversation, markAsRead } from "@/lib/data/chat";

const MANAGEMENT_ROLES = ['admin', 'manager', 'support', 'developer'];

// GET Inbox or Conversation
export async function GET(req) {
    try {
        const auth = await hasRole(MANAGEMENT_ROLES);
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const userId = auth.data.id;
        const { searchParams } = new URL(req.url);
        const recipientId = searchParams.get('recipientId');

        // If recipientId is provided, get the specific conversation
        if (recipientId) {
            const messages = await getConversation(userId, recipientId);
            // Mark as read when opening conversation
            await markAsRead(userId, recipientId);
            return NextResponse.json({ success: true, data: messages });
        }

        // Otherwise get the inbox (list of chats)
        const inbox = await getInbox(userId);
        return NextResponse.json({ success: true, data: inbox });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST Send message
export async function POST(req) {
    try {
        const auth = await hasRole(MANAGEMENT_ROLES);
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const senderId = auth.data.id;
        const { receiverId, message } = await req.json();

        if (!receiverId || !message) {
            return NextResponse.json({ success: false, message: "Recipient and message are required" }, { status: 400 });
        }

        const newMessage = await sendInternalMessage(senderId, receiverId, message);
        return NextResponse.json({
            success: true,
            message: "Message sent",
            data: newMessage
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
