import { NextResponse } from "next/server";
import { isLogin, isSupport, isAdmin } from "@/lib/middleware";
import { createTicket, getAllTickets, getTicketsByUser } from "@/lib/data/tickets";
import { createSupportRequest, getAllSupportRequests } from "@/lib/data/supports";

// GET tickets and support requests
export async function GET(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const user = auth.data;
        
        // Admin and Support can see all tickets and support requests
        if (user.role === 'admin' || user.role === 'support' || user.role === 'manager') {
            const tickets = await getAllTickets();
            const supportRequests = await getAllSupportRequests();
            return NextResponse.json({ 
                success: true, 
                data: {
                    tickets,
                    supportRequests
                } 
            });
        }

        // Regular users see only their own tickets
        const tickets = await getTicketsByUser(user.id);
        return NextResponse.json({ success: true, data: { tickets } });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST create ticket or support request
export async function POST(req) {
    try {
        const auth = await isLogin();
        const body = await req.json();

        // If user is logged in, create a ticket
        if (auth.success) {
            const { subject, message, priority } = body;

            if (!subject || !message) {
                return NextResponse.json({ success: false, message: "Subject and message are required" }, { status: 400 });
            }

            const ticket = await createTicket({
                user_id: auth.data.id,
                subject,
                message,
                priority: priority || 'medium'
            });

            return NextResponse.json({
                success: true,
                message: "Ticket created successfully",
                data: ticket
            }, { status: 201 });
        }

        // If user is NOT logged in (guest), create a support request
        const { name, email, subject, message, description } = body;
        
        // Handle both 'message' and 'description' fields for flexibility
        const finalDescription = description || message;

        if (!name || !email || !finalDescription) {
            return NextResponse.json({ 
                success: false, 
                message: "Name, email, and message are required for guest support requests" 
            }, { status: 400 });
        }

        const supportRequest = await createSupportRequest({
            name,
            email,
            subject: subject || "General Contact Inquiry",
            description: finalDescription
        });

        return NextResponse.json({
            success: true,
            message: "Your message has been sent successfully. We will get back to you soon.",
            data: supportRequest
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

