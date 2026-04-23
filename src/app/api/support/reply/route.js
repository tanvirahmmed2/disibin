import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/database/pg';
import { isSupport } from '@/lib/middleware';
import { sendEmail } from '@/lib/database/brevo';

export async function POST(req) {
    try {
        const auth = await isSupport();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const { id, reply, email, name, subject } = await req.json();

        if (!id || !reply || !email) {
            return NextResponse.json({ success: false, message: "ID, reply, and email are required" }, { status: 400 });
        }

        // Send Email via Brevo
        const emailRes = await sendEmail({
            toEmail: email,
            toName: name || 'User',
            subject: `Re: ${subject || 'Support Request'}`,
            htmlContent: `
                <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #059669;">Support Reply</h2>
                    <p>Hi ${name || 'there'},</p>
                    <p>Thank you for contacting us. Here is our response to your inquiry:</p>
                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        ${reply.replace(/\n/g, '<br/>')}
                    </div>
                    <p>Best regards,<br/>Disibin Support Team</p>
                </div>
            `
        });

        if (!emailRes.success) {
            return NextResponse.json({ success: false, message: "Failed to send email" }, { status: 500 });
        }

        // Update status in database
        await dbQuery("UPDATE support SET status = $1 WHERE support_id = $2", ['closed', id]);

        return NextResponse.json({ success: true, message: 'Reply sent successfully' });

    } catch (error) {
        console.error("Reply API Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
