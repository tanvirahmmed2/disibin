import { NextResponse } from "next/server";
import { isLogin } from "@/lib/middleware";
import { dbQuery } from "@/lib/database/pg";

// ── TICKET SYSTEM (tickets + ticket_messages) ────────────────────────────────
// Tickets are created by REGISTERED USERS (not guests).
// Staff (support | manager | admin) can see all tickets.
// Users can only see their own tickets.
// Replies are threaded inside ticket_messages.

const STAFF_ROLES = ['admin', 'manager', 'support'];

// GET /api/ticket — list tickets
export async function GET(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const { role, id: userId } = auth.data;

        if (STAFF_ROLES.includes(role)) {
            const res = await dbQuery(`
                SELECT t.*, 
                       u.name  as user_name,  u.email as user_email,
                       a.name  as assigned_name
                FROM tickets t
                LEFT JOIN users u ON t.user_id     = u.user_id
                LEFT JOIN users a ON t.assigned_to = a.user_id
                ORDER BY t.created_at DESC
            `);
            return NextResponse.json({ success: true, data: res.rows });
        }

        // Regular user — only their own tickets
        const res = await dbQuery(`
            SELECT * FROM tickets
            WHERE user_id = $1
            ORDER BY created_at DESC
        `, [userId]);

        return NextResponse.json({ success: true, data: res.rows });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST /api/ticket — create a new ticket (logged-in users only)
export async function POST(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const { subject, message, priority = 'medium' } = await req.json();

        if (!subject || !message) {
            return NextResponse.json({ success: false, message: "Subject and message are required" }, { status: 400 });
        }

        const res = await dbQuery(`
            INSERT INTO tickets (user_id, subject, message, priority)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `, [auth.data.id, subject, message, priority]);

        return NextResponse.json({
            success: true,
            message: "Ticket submitted successfully",
            data: res.rows[0]
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
