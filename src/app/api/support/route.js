import { NextResponse } from "next/server";
import { isLogin } from "@/lib/middleware";
import { dbQuery } from "@/lib/database/pg";

// GET tickets and support requests
export async function GET(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const user = auth.data;
        
        // Admin and Support can see all tickets and support requests
        if (user.role === 'admin' || user.role === 'support' || user.role === 'manager') {
            const ticketsRes = await dbQuery(`
                SELECT t.*, u.name as user_name, u.email as user_email, a.name as assigned_name
                FROM tickets t
                LEFT JOIN users u ON t.user_id = u.user_id
                LEFT JOIN users a ON t.assigned_to = a.user_id
                ORDER BY t.created_at DESC
            `);
            
            const supportsRes = await dbQuery(`
                SELECT s.*, u.name as responder_name
                FROM supports s
                LEFT JOIN users u ON s.responded_by = u.user_id
                ORDER BY s.created_at DESC
            `);

            return NextResponse.json({ 
                success: true, 
                data: {
                    tickets: ticketsRes.rows,
                    supportRequests: supportsRes.rows
                } 
            });
        }

        // Regular users see only their own tickets
        const res = await dbQuery(`
            SELECT * FROM tickets 
            WHERE user_id = $1 
            ORDER BY created_at DESC
        `, [user.id]);

        return NextResponse.json({ success: true, data: { tickets: res.rows } });

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

            const query = `
                INSERT INTO tickets (user_id, subject, message, priority)
                VALUES ($1, $2, $3, $4)
                RETURNING *
            `;
            const res = await dbQuery(query, [auth.data.id, subject, message, priority || 'medium']);
            const ticket = res.rows[0];

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

        const query = `
            INSERT INTO supports (name, email, subject, description)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const res = await dbQuery(query, [name, email, subject || "General Contact Inquiry", finalDescription]);
        const supportRequest = res.rows[0];

        return NextResponse.json({
            success: true,
            message: "Your message has been sent successfully. We will get back to you soon.",
            data: supportRequest
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

