import { NextResponse } from "next/server";
import { hasRole } from "@/lib/middleware";
import { getInbox, createConversation, findExistingOneOnOne } from "@/lib/data/chat";

const MANAGEMENT_ROLES = ['admin', 'manager', 'support', 'developer'];

// GET Inbox (List of conversations)
export async function GET(req) {
    try {
        const auth = await hasRole(MANAGEMENT_ROLES);
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const userId = auth.data.id;
        const inbox = await getInbox(userId);
        return NextResponse.json({ success: true, data: inbox });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST Create a new conversation (1-on-1 or group)
export async function POST(req) {
    try {
        const auth = await hasRole(MANAGEMENT_ROLES);
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const createdBy = auth.data.id;
        const { isGroup, title, participantIds } = await req.json();

        if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
            return NextResponse.json({ success: false, message: "Participants are required" }, { status: 400 });
        }

        // Check if 1-on-1 already exists
        if (!isGroup && participantIds.length === 1) {
            const existing = await findExistingOneOnOne(createdBy, participantIds[0]);
            if (existing) {
                return NextResponse.json({
                    success: true,
                    message: "Conversation already exists",
                    data: existing
                });
            }
        }

        // Create new conversation
        const conversationTitle = isGroup ? title : null; // 1-on-1 doesn't need a specific title usually
        const newConversation = await createConversation(isGroup, conversationTitle, createdBy, participantIds);
        
        return NextResponse.json({
            success: true,
            message: "Conversation created",
            data: newConversation
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
