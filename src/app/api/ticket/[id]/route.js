import { NextResponse } from "next/server";
import { isLogin, hasRole } from "@/lib/middleware";
import { getTicketDetails, updateTicketStatus, assignTicket } from "@/lib/data/tickets";

const STAFF_ROLES = ['admin', 'manager', 'support'];

// GET ticket details + messages
export async function GET(req, { params }) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const ticketId = params.id;
        const ticket = await getTicketDetails(ticketId);

        if (!ticket) {
            return NextResponse.json({ success: false, message: "Ticket not found" }, { status: 404 });
        }

        // Regular users can only view their own ticket
        if (auth.data.role === 'user' && ticket.user_id !== auth.data.id) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        return NextResponse.json({ success: true, data: ticket });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PATCH update ticket status or assign to manager (staff only)
export async function PATCH(req, { params }) {
    try {
        const auth = await hasRole(STAFF_ROLES);
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const ticketId = params.id;
        const { status, assigned_to } = await req.json();

        let result;

        if (assigned_to !== undefined) {
            result = await assignTicket(ticketId, assigned_to);
        } else if (status) {
            result = await updateTicketStatus(ticketId, status);
        } else {
            return NextResponse.json({ success: false, message: "No update data provided" }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: "Ticket updated",
            data: result
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
