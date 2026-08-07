import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { sendEmail } from "@/lib/database/brevo";
import { isTeamLogin, isManager, isSupport } from "@/lib/auth/team";

// Helper — check if manager OR support role
async function isManagerOrSupport() {
    const auth = await isTeamLogin();
    if (!auth.success) return { success: false, message: "Please login" };
    if (auth.data.role !== "manager" && auth.data.role !== "support") {
        return { success: false, message: "Access denied: Manager or Support role required" };
    }
    return { success: true, data: auth.data };
}

// GET — List all support requests (Manager or Support)
export async function GET(req) {
    try {
        const auth = await isManagerOrSupport();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status"); // optional: 'pending' | 'replied'

        let query = `
            SELECT 
                s.id, s.name, s.email, s.subject, s.description,
                s.reply, s.status, s.responded_by,
                s.created_at, s.updated_at,
                t.name AS responder_name
            FROM supports s
            LEFT JOIN teams t ON s.responded_by = t.id
        `;
        const params = [];

        if (status && ["pending", "replied"].includes(status)) {
            query += ` WHERE s.status = $1`;
            params.push(status);
        }

        query += ` ORDER BY s.created_at DESC`;

        const res = await dbQuery(query, params);
        return NextResponse.json({ success: true, data: res.rows });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PATCH — Reply to a support request, send email, record activity log
export async function PATCH(req) {
    try {
        const auth = await isManagerOrSupport();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const body = await req.json();
        const { id, reply } = body;

        if (!id) {
            return NextResponse.json({ success: false, message: "Support request ID is required" }, { status: 400 });
        }
        if (!reply || !reply.trim()) {
            return NextResponse.json({ success: false, message: "Reply text cannot be empty" }, { status: 400 });
        }

        // Fetch the support request
        const supportRes = await dbQuery("SELECT * FROM supports WHERE id = $1", [id]);
        const support = supportRes.rows[0];

        if (!support) {
            return NextResponse.json({ success: false, message: "Support request not found" }, { status: 404 });
        }

        // Save reply, mark as replied, record who responded
        const updateRes = await dbQuery(
            `UPDATE supports 
             SET reply = $1, status = 'replied', responded_by = $2, updated_at = now()
             WHERE id = $3
             RETURNING id, name, email, subject, description, reply, status, responded_by, created_at, updated_at`,
            [reply.trim(), auth.data.id, id]
        );
        const updated = updateRes.rows[0];

        // Send reply email to the original submitter
        const htmlContent = `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 10px;">
                <h1 style="color: #0f172a; font-size: 22px; font-weight: 700; margin-bottom: 8px;">Reply to your support request</h1>
                <p style="color: #64748b; margin-bottom: 4px;">Hi ${support.name},</p>
                <p style="color: #64748b; line-height: 1.6; margin-bottom: 20px;">
                    We've replied to your support request. Here is our response:
                </p>
                <div style="background: #f8fafc; border-left: 4px solid #0ea5e9; border-radius: 6px; padding: 16px 20px; margin-bottom: 24px;">
                    <p style="color: #1e293b; margin: 0; line-height: 1.7;">${reply.replace(/<[^>]+>/g, " ").trim()}</p>
                </div>
                <p style="color: #64748b; margin-bottom: 4px;"><strong>Your original message:</strong></p>
                <p style="color: #94a3b8; font-size: 13px; line-height: 1.6; margin-bottom: 24px;">${support.subject}</p>
                <p style="color: #94a3b8; font-size: 12px;">Reference ID: #${support.id} · Disibin Support</p>
            </div>
        `;

        sendEmail({
            to: support.email,
            toName: support.name,
            subject: `Re: ${support.subject} — Disibin Support`,
            htmlContent
        }).catch((err) => console.error("Reply email failed:", err));

        // Record in activity_logs
        await dbQuery(
            `INSERT INTO activity_logs (team_id, action, entity_type, entity_id, description)
             VALUES ($1, $2, $3, $4, $5)`,
            [
                auth.data.id,
                "SUPPORT_REPLY",
                "support",
                id,
                `Replied to support request #${id} from ${support.name} (${support.email})`
            ]
        ).catch((err) => console.error("Activity log failed:", err));

        // Send in-app notification if user account exists with this email
        const userMatchRes = await dbQuery("SELECT id FROM users WHERE email = $1 LIMIT 1", [support.email]).catch(() => ({ rows: [] }));
        if (userMatchRes.rows.length > 0) {
            const userId = userMatchRes.rows[0].id;
            await dbQuery(`
                INSERT INTO notifications (user_id, title, message, type, link)
                VALUES ($1, $2, $3, $4, $5)
            `, [
                userId,
                "Support Inquiry Replied 💬",
                `We responded to your support inquiry "${support.subject}": "${reply.trim().substring(0, 80)}${reply.trim().length > 80 ? '...' : ''}"`,
                "ticket",
                "/user/tickets"
            ]).catch((err) => console.error("Support notification insertion failed:", err));
        }

        // Return updated record with responder name
        return NextResponse.json({
            success: true,
            message: "Reply saved and email sent to the submitter",
            data: { ...updated, responder_name: auth.data.name }
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE — Delete a support request (Manager or Support)
export async function DELETE(req) {
    try {
        const auth = await isManagerOrSupport();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ success: false, message: "Support request ID is required" }, { status: 400 });
        }

        const res = await dbQuery(
            "DELETE FROM supports WHERE id = $1 RETURNING id, name, email, subject",
            [id]
        );

        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Support request not found" }, { status: 404 });
        }

        const deleted = res.rows[0];

        // Record in activity_logs
        await dbQuery(
            `INSERT INTO activity_logs (team_id, action, entity_type, entity_id, description)
             VALUES ($1, $2, $3, $4, $5)`,
            [
                auth.data.id,
                "SUPPORT_DELETE",
                "support",
                id,
                `Deleted support request #${id} from ${deleted.name} (${deleted.email}) — Subject: ${deleted.subject}`
            ]
        ).catch((err) => console.error("Activity log failed:", err));

        return NextResponse.json({
            success: true,
            message: "Support request deleted successfully",
            data: deleted
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
