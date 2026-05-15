import { NextResponse } from "next/server";
import { isLogin, isSupport, hasRole } from "@/lib/middleware";
import { getTicketDetails, addTicketMessage, updateTicketStatus } from "@/lib/data/tickets";

// GET ticket details and messages
export async function GET(req, { params }) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const { id } = await params;
        const ticket = await getTicketDetails(id);

        if (!ticket) {
            return NextResponse.json({ success: false, message: "Ticket not found" }, { status: 404 });
        }

        // Security: Check if user owns the ticket or is staff
        const user = auth.data;
        const isStaff = ['admin', 'support', 'manager'].includes(user.role);
        if (!isStaff && ticket.user_id !== user.id) {
            return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
        }

        return NextResponse.json({ success: true, data: ticket });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST add message (Reply)
export async function POST(req, { params }) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const { id } = await params;
        const { message, attachments } = await req.json();

        if (!message) {
            return NextResponse.json({ success: false, message: "Message is required" }, { status: 400 });
        }

        // Verify access (owner or staff)
        const ticket = await getTicketDetails(id);
        if (!ticket) return NextResponse.json({ success: false, message: "Ticket not found" }, { status: 404 });

        const user = auth.data;
        const isStaff = ['admin', 'support', 'manager'].includes(user.role);
        if (!isStaff && ticket.user_id !== user.id) {
            return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
        }

        const newMessage = await addTicketMessage({
            ticket_id: id,
            user_id: user.id,
            message,
            attachments
        });

        return NextResponse.json({
            success: true,
            message: "Reply sent successfully",
            data: newMessage
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PATCH update status (Staff only)
export async function PATCH(req, { params }) {
    try {
        const auth = await hasRole(['admin', 'support', 'manager']);
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { id } = await params;
        const { status, assigned_to } = await req.json();

        if (!status) {
            return NextResponse.json({ success: false, message: "Status is required" }, { status: 400 });
        }

        const updatedTicket = await updateTicketStatus(id, status, assigned_to);
        
        return NextResponse.json({
            success: true,
            message: "Ticket updated successfully",
            data: updatedTicket
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
