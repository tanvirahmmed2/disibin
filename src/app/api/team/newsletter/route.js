import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isManager } from "@/lib/auth/team";
import { sendEmail } from "@/lib/database/brevo";

// GET — Fetch lead counts for newsletter metrics
export async function GET() {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const clientRes = await dbQuery("SELECT COUNT(*) FROM client_leads WHERE email IS NOT NULL AND email != ''");
        const businessRes = await dbQuery("SELECT COUNT(*) FROM business_leads WHERE email IS NOT NULL AND email != ''");

        const clientLeadsCount = parseInt(clientRes.rows[0]?.count || 0);
        const businessLeadsCount = parseInt(businessRes.rows[0]?.count || 0);
        const totalAudience = clientLeadsCount + businessLeadsCount;

        return NextResponse.json({
            success: true,
            data: {
                clientLeadsCount,
                businessLeadsCount,
                totalAudience
            }
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST — Send newsletter campaign to selected lead group using Brevo
export async function POST(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const body = await req.json();
        const { targetGroup, subject, message } = body;

        if (!subject || !subject.trim()) {
            return NextResponse.json({ success: false, message: "Email subject is required" }, { status: 400 });
        }
        if (!message || !message.trim()) {
            return NextResponse.json({ success: false, message: "Email message content is required" }, { status: 400 });
        }

        const validGroups = ["all", "clients", "business"];
        const group = validGroups.includes(targetGroup) ? targetGroup : "all";

        let recipients = [];

        if (group === "clients") {
            const res = await dbQuery("SELECT name, email FROM client_leads WHERE email IS NOT NULL AND email != ''");
            recipients = res.rows;
        } else if (group === "business") {
            const res = await dbQuery("SELECT name, email FROM business_leads WHERE email IS NOT NULL AND email != ''");
            recipients = res.rows;
        } else {
            // Combine both tables and deduplicate by email
            const clientRes = await dbQuery("SELECT name, email FROM client_leads WHERE email IS NOT NULL AND email != ''");
            const businessRes = await dbQuery("SELECT name, email FROM business_leads WHERE email IS NOT NULL AND email != ''");

            const map = new Map();
            for (const item of [...clientRes.rows, ...businessRes.rows]) {
                if (item.email && !map.has(item.email.toLowerCase())) {
                    map.set(item.email.toLowerCase(), item);
                }
            }
            recipients = Array.from(map.values());
        }

        if (recipients.length === 0) {
            return NextResponse.json({ success: false, message: "No email recipients found in the selected group" }, { status: 400 });
        }

        // Send email to each recipient via Brevo
        let sentCount = 0;
        let failCount = 0;

        const emailSubject = subject.trim();
        const emailMessageHtml = message.trim();

        for (const recipient of recipients) {
            const htmlContent = `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 32px; border: 1px solid #f0f0f0; border-radius: 12px; background-color: #ffffff;">
                    <h2 style="color: #0f172a; margin-top: 0; font-size: 20px; font-weight: 700;">${emailSubject}</h2>
                    <p style="color: #475569; font-size: 14px; margin-bottom: 20px;">Hi ${recipient.name || 'Valued Lead'},</p>
                    <div style="color: #334155; line-height: 1.6; font-size: 14px; margin-bottom: 28px;">
                        ${emailMessageHtml}
                    </div>
                    <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
                    <p style="color: #94a3b8; font-size: 12px; margin: 0;">Disibin Official Newsletter · You received this email as a registered lead.</p>
                </div>
            `;

            const emailResult = await sendEmail({
                toEmail: recipient.email,
                toName: recipient.name,
                subject: emailSubject,
                htmlContent
            });

            if (emailResult.success) {
                sentCount++;
            } else {
                failCount++;
            }
        }

        // Record activity log
        await dbQuery(`
            INSERT INTO activity_logs (team_id, action, entity_type, description)
            VALUES ($1, $2, $3, $4)
        `, [
            auth.data.id,
            'NEWSLETTER_SEND',
            'newsletter',
            `Sent newsletter "${emailSubject}" to ${sentCount} recipients (Group: ${group})`
        ]).catch(() => {});

        return NextResponse.json({
            success: true,
            message: `Newsletter sent successfully to ${sentCount} recipient(s)${failCount > 0 ? ` (${failCount} failed)` : ''}`,
            data: {
                sentCount,
                failCount,
                totalRecipients: recipients.length
            }
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
