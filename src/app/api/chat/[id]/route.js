import { NextResponse } from "next/server";
import { hasRole } from "@/lib/middleware";
import { getConversationMessages, sendMessage, markAsRead } from "@/lib/data/chat";

const MANAGEMENT_ROLES = ['admin', 'manager', 'support', 'developer'];

// GET messages for a specific conversation
export async function GET(req, { params }) {
    try {
        const auth = await hasRole(MANAGEMENT_ROLES);
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const userId = auth.data.id;
        const conversationId = params.id;

        const messages = await getConversationMessages(conversationId, userId);
        
        // Mark conversation as read
        await markAsRead(conversationId, userId);

        return NextResponse.json({ success: true, data: messages });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST send a message to a specific conversation
export async function POST(req, { params }) {
    try {
        const auth = await hasRole(MANAGEMENT_ROLES);
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const senderId = auth.data.id;
        const conversationId = params.id;
        const { content } = await req.json();

        if (!content) {
            return NextResponse.json({ success: false, message: "Message content is required" }, { status: 400 });
        }

        const newMessage = await sendMessage(conversationId, senderId, content);
        
        return NextResponse.json({
            success: true,
            message: "Message sent",
            data: newMessage
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
