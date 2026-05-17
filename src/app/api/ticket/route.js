import { NextResponse } from "next/server";
import { isLogin } from "@/lib/middleware";
import { dbQuery } from "@/lib/database/pg";

// GET tickets
export async function GET(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const { role, id: userId } = auth.data;

        if (role === 'support' || role === 'manager' || role === 'admin') {
            const res = await dbQuery(`
                SELECT t.*, u.name as user_name, u.email as user_email, a.name as assigned_name
                FROM tickets t
                LEFT JOIN users u ON t.user_id = u.user_id
                LEFT JOIN users a ON t.assigned_to = a.user_id
                ORDER BY t.created_at DESC
            `);
            return NextResponse.json({ success: true, data: res.rows });
        }

        // Regular user — only their own
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

        const query = `
            INSERT INTO tickets (user_id, subject, message, priority)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const res = await dbQuery(query, [userId, subject, message, priority]);
        const ticket = res.rows[0];

        return NextResponse.json({
            success: true,
            message: "Ticket submitted successfully",
            data: ticket
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
