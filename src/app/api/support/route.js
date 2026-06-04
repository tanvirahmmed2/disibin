import { NextResponse } from "next/server";
import { isLogin, isSupport } from "@/lib/middleware";
import { dbQuery } from "@/lib/database/pg";

// ── SUPPORT INBOX (supports table) ─────────────────────────────────────────
// This route handles the "Contact Form" / "Support Inbox" system.
// - Submissions come from GUESTS (no login required) via the public contact form.
// - Staff (support / manager / admin) can read all requests.
// - NOT the same as tickets (which are for registered users with threaded replies).

// GET /api/support — fetch all support/contact requests (staff only)
export async function GET(req) {
    try {
        const auth = await isSupport(); // support | manager | admin
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const res = await dbQuery(`
            SELECT s.*, u.name as responder_name
            FROM supports s
            LEFT JOIN users u ON s.responded_by = u.user_id
            ORDER BY s.created_at DESC
        `);

        return NextResponse.json({ success: true, data: res.rows });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST /api/support — create a new support/contact request (PUBLIC, no auth required)
export async function POST(req) {
    try {
        const body = await req.json();
        const { name, email, subject, description, message } = body;

        // Accept either 'description' or 'message' for flexibility
        const content = description || message;

        if (!name || !email || !subject || !content) {
            return NextResponse.json({
                success: false,
                message: "Name, email, subject, and message are required"
            }, { status: 400 });
        }

        const res = await dbQuery(`
            INSERT INTO supports (name, email, subject, description)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `, [name, email, subject, content]);

        return NextResponse.json({
            success: true,
            message: "Your message has been sent. We will get back to you soon.",
            data: res.rows[0]
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
