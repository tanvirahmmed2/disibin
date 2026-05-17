import { NextResponse } from "next/server";
import { isLogin, hasRole } from "@/lib/middleware";
import { createTicket, getAllTickets, getTicketsByUser } from "@/lib/data/tickets";

// GET tickets
export async function GET(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const { role, id: userId } = auth.data;

        if (role === 'support' || role === 'manager' || role === 'admin') {
            const tickets = await getAllTickets();
            return NextResponse.json({ success: true, data: tickets });
        }

        // Regular user — only their own
        const tickets = await getTicketsByUser(userId);
        return NextResponse.json({ success: true, data: tickets });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST create a new ticket (any logged-in user)
export async function POST(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const userId = auth.data.id;
        const { subject, message, priority = 'medium' } = await req.json();

        if (!subject || !message) {
            return NextResponse.json({ success: false, message: "Subject and message are required" }, { status: 400 });
        }

        const ticket = await createTicket({ user_id: userId, subject, message, priority });

        return NextResponse.json({
            success: true,
            message: "Ticket submitted successfully",
            data: ticket
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
