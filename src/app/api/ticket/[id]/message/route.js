import { NextResponse } from "next/server";
import { isLogin } from "@/lib/middleware";
import { addTicketMessage, getTicketDetails } from "@/lib/data/tickets";

// POST add a reply to a ticket
export async function POST(req, { params }) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const ticketId = params.id;
        const userId = auth.data.id;
        const { message } = await req.json();

        if (!message) {
            return NextResponse.json({ success: false, message: "Message is required" }, { status: 400 });
        }

        // Ensure ticket exists and user is authorized
        const ticket = await getTicketDetails(ticketId);
        if (!ticket) {
            return NextResponse.json({ success: false, message: "Ticket not found" }, { status: 404 });
        }

        // Regular users can only reply to their own ticket
        if (auth.data.role === 'user' && ticket.user_id !== auth.data.id) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        const newMessage = await addTicketMessage({ ticket_id: ticketId, user_id: userId, message });

        return NextResponse.json({
            success: true,
            message: "Reply sent",
            data: newMessage
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
