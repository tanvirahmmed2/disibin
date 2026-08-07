import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isManager } from "@/lib/auth/team";
import { sendEmail } from "@/lib/database/brevo";

// GET — Fetch lead and user audience counts for newsletter metrics
export async function GET() {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const clientRes = await dbQuery("SELECT COUNT(*) FROM client_leads WHERE email IS NOT NULL AND email != ''").catch(() => ({ rows: [{ count: 0 }] }));
        const businessRes = await dbQuery("SELECT COUNT(*) FROM business_leads WHERE email IS NOT NULL AND email != ''").catch(() => ({ rows: [{ count: 0 }] }));
        const userRes = await dbQuery("SELECT COUNT(*) FROM users WHERE email IS NOT NULL AND email != ''").catch(() => ({ rows: [{ count: 0 }] }));

        const clientLeadsCount = parseInt(clientRes.rows[0]?.count || 0);
        const businessLeadsCount = parseInt(businessRes.rows[0]?.count || 0);
        const registeredUsersCount = parseInt(userRes.rows[0]?.count || 0);
        const totalAudience = clientLeadsCount + businessLeadsCount + registeredUsersCount;

        return NextResponse.json({
            success: true,
            data: {
                clientLeadsCount,
                businessLeadsCount,
                registeredUsersCount,
                totalAudience
            }
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST — Send newsletter campaign to selected group using Brevo
export async function POST(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const body = await req.json();
        const { targetGroup, subject, message, testEmail } = body;

        if (!subject || !subject.trim()) {
            return NextResponse.json({ success: false, message: "Email subject line is required" }, { status: 400 });
        }
        if (!message || !message.trim()) {
            return NextResponse.json({ success: false, message: "Email message content is required" }, { status: 400 });
        }

        const emailSubject = subject.trim();
        const emailMessageHtml = message.trim();

        // If test email is requested
        if (testEmail && testEmail.trim()) {
            const cleanTestEmail = testEmail.trim();
            const htmlContent = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 32px; border: 1px solid #f0f0f0; border-radius: 12px; background-color: #ffffff;">
                    <div style="background: #f8fafc; padding: 12px 16px; border-radius: 8px; font-size: 12px; color: #64748b; font-weight: bold; margin-bottom: 20px;">
                        [TEST CAMPAIGN PREVIEW]
                    </div>
                    <h2 style="color: #0f172a; margin-top: 0; font-size: 20px; font-weight: 700;">${emailSubject}</h2>
                    <p style="color: #475569; font-size: 14px; margin-bottom: 20px;">Hi Test Recipient,</p>
                    <div style="color: #334155; line-height: 1.6; font-size: 14px; margin-bottom: 28px;">
                        ${emailMessageHtml}
                    </div>
                    <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
                    <p style="color: #94a3b8; font-size: 12px; margin: 0;">Disibin Official Newsletter Test Mail</p>
                </div>
            `;

            const testResult = await sendEmail({
                toEmail: cleanTestEmail,
                toName: "Test Recipient",
                subject: `[TEST] ${emailSubject}`,
                htmlContent
            });

            if (!testResult.success) {
                const errDetail = typeof testResult.error === 'object' ? JSON.stringify(testResult.error) : String(testResult.error);
                return NextResponse.json({
                    success: false,
                    message: `Test email sending failed: ${errDetail}`
                }, { status: 500 });
            }

            return NextResponse.json({
                success: true,
                message: `Test email successfully sent to ${cleanTestEmail}`
            });
        }

        const validGroups = ["all", "clients", "business", "users"];
        const group = validGroups.includes(targetGroup) ? targetGroup : "all";

        let recipients = [];

        if (group === "clients") {
            const res = await dbQuery("SELECT name, email FROM client_leads WHERE email IS NOT NULL AND email != ''");
            recipients = res.rows;
        } else if (group === "business") {
            const res = await dbQuery("SELECT name, email FROM business_leads WHERE email IS NOT NULL AND email != ''");
            recipients = res.rows;
        } else if (group === "users") {
            const res = await dbQuery("SELECT name, email FROM users WHERE email IS NOT NULL AND email != ''");
            recipients = res.rows;
        } else {
            // Combine client_leads, business_leads, and users — deduplicate by email
            const clientRes = await dbQuery("SELECT name, email FROM client_leads WHERE email IS NOT NULL AND email != ''").catch(() => ({ rows: [] }));
            const businessRes = await dbQuery("SELECT name, email FROM business_leads WHERE email IS NOT NULL AND email != ''").catch(() => ({ rows: [] }));
            const userRes = await dbQuery("SELECT name, email FROM users WHERE email IS NOT NULL AND email != ''").catch(() => ({ rows: [] }));

            const map = new Map();
            for (const item of [...clientRes.rows, ...businessRes.rows, ...userRes.rows]) {
                if (item.email && !map.has(item.email.toLowerCase())) {
                    map.set(item.email.toLowerCase(), item);
                }
            }
            recipients = Array.from(map.values());
        }

        if (recipients.length === 0) {
            return NextResponse.json({ success: false, message: "No email recipients found in the selected target group" }, { status: 400 });
        }

        // Send email to each recipient via Brevo
        let sentCount = 0;
        let failCount = 0;
        let lastError = null;

        for (const recipient of recipients) {
            const htmlContent = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 32px; border: 1px solid #f0f0f0; border-radius: 12px; background-color: #ffffff;">
                    <h2 style="color: #0f172a; margin-top: 0; font-size: 20px; font-weight: 700;">${emailSubject}</h2>
                    <p style="color: #475569; font-size: 14px; margin-bottom: 20px;">Hi ${recipient.name || 'Valued Subscriber'},</p>
                    <div style="color: #334155; line-height: 1.6; font-size: 14px; margin-bottom: 28px;">
                        ${emailMessageHtml}
                    </div>
                    <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
                    <p style="color: #94a3b8; font-size: 12px; margin: 0;">Disibin Official Newsletter · You received this email because you are registered with Disibin.</p>
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
                lastError = emailResult.error;
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
            `Sent newsletter "${emailSubject}" to ${sentCount} recipients (Group: ${group}, Failed: ${failCount})`
        ]).catch(() => {});

        if (sentCount === 0 && failCount > 0) {
            const errString = typeof lastError === 'object' ? JSON.stringify(lastError) : String(lastError || 'Mailer error');
            return NextResponse.json({
                success: false,
                message: `Failed to dispatch emails to recipients: ${errString}`
            }, { status: 500 });
        }

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
