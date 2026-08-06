import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { sendEmail } from "@/lib/database/brevo";

// POST — Public issue report submission (no auth required)
export async function POST(req) {
    try {
        const body = await req.json();
        const { name, email, subject, description } = body;

        if (!name || !email || !subject || !description) {
            return NextResponse.json(
                { success: false, message: "All fields are required (name, email, subject, description)" },
                { status: 400 }
            );
        }

        // Basic email format check
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json(
                { success: false, message: "Invalid email address" },
                { status: 400 }
            );
        }

        // Insert into reports table
        const res = await dbQuery(
            `INSERT INTO reports (name, email, subject, description) VALUES ($1, $2, $3, $4) RETURNING id, name, email, subject, created_at`,
            [name, email, subject, description]
        );
        const report = res.rows[0];

        // Send confirmation email to submitter
        const htmlContent = `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 10px;">
                <h1 style="color: #0f172a; font-size: 22px; font-weight: 700; margin-bottom: 8px;">We received your issue report</h1>
                <p style="color: #64748b; line-height: 1.6; margin-bottom: 16px;">Hi ${name}, thank you for reporting an issue to Disibin. We've received your report and our engineering/support team will investigate it promptly.</p>
                <div style="background: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                    <p style="color: #475569; margin: 0 0 6px;"><strong>Subject:</strong> ${subject}</p>
                    <p style="color: #475569; margin: 0;"><strong>Report Reference ID:</strong> #${report.id}</p>
                </div>
                <p style="color: #94a3b8; font-size: 12px;">If you did not submit this issue report, please ignore this email.</p>
            </div>
        `;

        // Send async — don't block response on email failure
        sendEmail({ to: email, toName: name, subject: `We received your issue report — Disibin`, htmlContent }).catch(
            (err) => console.error("Report confirmation email failed:", err)
        );

        return NextResponse.json(
            { success: true, message: "Your issue report has been submitted successfully. We'll look into it!" },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
