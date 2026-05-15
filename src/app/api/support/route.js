import { NextResponse } from "next/server";
import { isLogin, isSupport, isAdmin } from "@/lib/middleware";
import { createTicket, getAllTickets, getTicketsByUser } from "@/lib/data/tickets";

// GET tickets
export async function GET(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const user = auth.data;
        
        // Admin and Support can see all tickets
        if (user.role === 'admin' || user.role === 'support' || user.role === 'manager') {
            const tickets = await getAllTickets();
            return NextResponse.json({ success: true, data: tickets });
        }

        // Regular users see only their own
        const tickets = await getTicketsByUser(user.id);
        return NextResponse.json({ success: true, data: tickets });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST create ticket
export async function POST(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const body = await req.json();
        const { subject, message, priority } = body;

        if (!subject || !message) {
            return NextResponse.json({ success: false, message: "Subject and message are required" }, { status: 400 });
        }

        const ticket = await createTicket({
            user_id: auth.data.id,
            subject,
            message,
            priority
        });

        return NextResponse.json({
            success: true,
            message: "Ticket created successfully",
            data: ticket
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
