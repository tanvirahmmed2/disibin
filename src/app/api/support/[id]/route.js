import { NextResponse } from "next/server";
import { isSupport } from "@/lib/middleware";
import { dbQuery } from "@/lib/database/pg";

// ── SUPPORT INBOX — single request operations ───────────────────────────────
// All endpoints here operate on the `supports` table (contact form submissions).
// Staff only (support | manager | admin).

// GET /api/support/[id] — fetch a single support request with its internal messages
export async function GET(req, { params }) {
    try {
        const auth = await isSupport();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { id } = await params;

        const supportRes = await dbQuery(`
            SELECT s.*, u.name as responder_name
            FROM supports s
            LEFT JOIN users u ON s.responded_by = u.user_id
            WHERE s.support_id = $1
        `, [id]);

        if (supportRes.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Support request not found" }, { status: 404 });
        }

        // Fetch any internal staff notes/messages on this request
        const messagesRes = await dbQuery(`
            SELECT sm.*, u.name as user_name, u.role as user_role
            FROM support_messages sm
            LEFT JOIN users u ON sm.user_id = u.user_id
            WHERE sm.support_id = $1
            ORDER BY sm.created_at ASC
        `, [id]);

        return NextResponse.json({
            success: true,
            data: {
                ...supportRes.rows[0],
                messages: messagesRes.rows,
            }
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST /api/support/[id] — add an internal staff note/message to a support request
export async function POST(req, { params }) {
    try {
        const auth = await isSupport();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { id } = await params;
        const { message } = await req.json();

        if (!message?.trim()) {
            return NextResponse.json({ success: false, message: "Message is required" }, { status: 400 });
        }

        // Verify support request exists
        const checkRes = await dbQuery("SELECT support_id FROM supports WHERE support_id = $1", [id]);
        if (checkRes.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Support request not found" }, { status: 404 });
        }

        const res = await dbQuery(`
            INSERT INTO support_messages (support_id, user_id, message)
            VALUES ($1, $2, $3)
            RETURNING *
        `, [id, auth.data.id, message.trim()]);

        return NextResponse.json({ success: true, data: res.rows[0], message: "Note added" });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PATCH /api/support/[id] — mark as replied and optionally store reply text
export async function PATCH(req, { params }) {
    try {
        const auth = await isSupport();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { id } = await params;
        const body = await req.json().catch(() => ({}));
        const { reply } = body;

        const res = await dbQuery(`
            UPDATE supports
            SET status = 'replied',
                responded_by = $1,
                reply = COALESCE($2, reply)
            WHERE support_id = $3
            RETURNING *
        `, [auth.data.id, reply || null, id]);

        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Support request not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Support request marked as replied",
            data: res.rows[0]
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE /api/support/[id] — permanently delete a support request
export async function DELETE(req, { params }) {
    try {
        const auth = await isSupport();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { id } = await params;

        const res = await dbQuery(
            "DELETE FROM supports WHERE support_id = $1 RETURNING *",
            [id]
        );

        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Support request not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Deleted successfully" });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
