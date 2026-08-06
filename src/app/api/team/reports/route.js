import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { sendEmail } from "@/lib/database/brevo";
import { isTeamLogin } from "@/lib/auth/team";

// Helper — check team authentication (Manager, Developer, Support)
async function isAuthorizedTeamMember() {
    const auth = await isTeamLogin();
    if (!auth.success) return { success: false, message: "Please login" };
    const role = auth.data.role;
    if (role !== "manager" && role !== "support" && role !== "developer") {
        return { success: false, message: "Access denied: Manager, Support, or Developer role required" };
    }
    return { success: true, data: auth.data };
}

// GET — List all reports (Manager, Developer, Support)
export async function GET(req) {
    try {
        const auth = await isAuthorizedTeamMember();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status"); // optional: 'pending' | 'replied'

        let query = `
            SELECT 
                r.id, r.name, r.email, r.subject, r.description,
                r.reply, r.status, r.responded_by,
                r.created_at, r.updated_at,
                t.name AS responder_name
            FROM reports r
            LEFT JOIN teams t ON r.responded_by = t.id
        `;
        const params = [];

        if (status && ["pending", "replied"].includes(status)) {
            query += ` WHERE r.status = $1`;
            params.push(status);
        }

        query += ` ORDER BY r.created_at DESC`;

        const res = await dbQuery(query, params);
        return NextResponse.json({ success: true, data: res.rows });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PATCH — Reply to a report, send email, record activity log
export async function PATCH(req) {
    try {
        const auth = await isAuthorizedTeamMember();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const body = await req.json();
        const { id, reply } = body;

        if (!id) {
            return NextResponse.json({ success: false, message: "Report ID is required" }, { status: 400 });
        }
        if (!reply || !reply.trim()) {
            return NextResponse.json({ success: false, message: "Reply text cannot be empty" }, { status: 400 });
        }

        // Fetch the report
        const reportRes = await dbQuery("SELECT * FROM reports WHERE id = $1", [id]);
        const report = reportRes.rows[0];

        if (!report) {
            return NextResponse.json({ success: false, message: "Report not found" }, { status: 404 });
        }

        // Save reply, mark as replied, record who responded
        const updateRes = await dbQuery(
            `UPDATE reports 
             SET reply = $1, status = 'replied', responded_by = $2, updated_at = now()
             WHERE id = $3
             RETURNING id, name, email, subject, description, reply, status, responded_by, created_at, updated_at`,
            [reply.trim(), auth.data.id, id]
        );
        const updated = updateRes.rows[0];

        // Send reply email to the original submitter
        const htmlContent = `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 10px;">
                <h1 style="color: #0f172a; font-size: 22px; font-weight: 700; margin-bottom: 8px;">Update regarding your issue report</h1>
                <p style="color: #64748b; margin-bottom: 4px;">Hi ${report.name},</p>
                <p style="color: #64748b; line-height: 1.6; margin-bottom: 20px;">
                    We've reviewed and responded to your report. Here is our response:
                </p>
                <div style="background: #f8fafc; border-left: 4px solid #0ea5e9; border-radius: 6px; padding: 16px 20px; margin-bottom: 24px;">
                    <p style="color: #1e293b; margin: 0; line-height: 1.7;">${reply.replace(/<[^>]+>/g, " ").trim()}</p>
                </div>
                <p style="color: #64748b; margin-bottom: 4px;"><strong>Your original issue report:</strong></p>
                <p style="color: #94a3b8; font-size: 13px; line-height: 1.6; margin-bottom: 24px;">${report.subject}</p>
                <p style="color: #94a3b8; font-size: 12px;">Report ID: #${report.id} · Disibin Team</p>
            </div>
        `;

        sendEmail({
            to: report.email,
            toName: report.name,
            subject: `Re: ${report.subject} — Disibin Issue Report`,
            htmlContent
        }).catch((err) => console.error("Report reply email failed:", err));

        // Record in activity_logs
        await dbQuery(
            `INSERT INTO activity_logs (team_id, action, entity_type, entity_id, description)
             VALUES ($1, $2, $3, $4, $5)`,
            [
                auth.data.id,
                "REPORT_REPLY",
                "report",
                id,
                `Replied to report #${id} from ${report.name} (${report.email})`
            ]
        ).catch((err) => console.error("Activity log failed:", err));

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

// DELETE — Delete a report (Manager, Developer, Support)
export async function DELETE(req) {
    try {
        const auth = await isAuthorizedTeamMember();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ success: false, message: "Report ID is required" }, { status: 400 });
        }

        const res = await dbQuery(
            "DELETE FROM reports WHERE id = $1 RETURNING id, name, email, subject",
            [id]
        );

        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Report not found" }, { status: 404 });
        }

        const deleted = res.rows[0];

        // Record in activity_logs
        await dbQuery(
            `INSERT INTO activity_logs (team_id, action, entity_type, entity_id, description)
             VALUES ($1, $2, $3, $4, $5)`,
            [
                auth.data.id,
                "REPORT_DELETE",
                "report",
                id,
                `Deleted report #${id} from ${deleted.name} (${deleted.email}) — Subject: ${deleted.subject}`
            ]
        ).catch((err) => console.error("Activity log failed:", err));

        return NextResponse.json({
            success: true,
            message: "Report deleted successfully",
            data: deleted
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
