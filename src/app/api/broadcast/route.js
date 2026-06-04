import { NextResponse } from "next/server";
import { isManager } from "@/lib/middleware";
import { dbQuery, transaction } from "@/lib/database/pg";
import { sendEmail } from "@/lib/utils/brevo";

export async function POST(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const body = await req.json();
        const { subject, message, audience, sendEmailCopy } = body;

        if (!subject || !message || !audience) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        // Determine target users based on audience
        let userQuery = "";
        if (audience === "users") {
            userQuery = "SELECT user_id, email, name FROM users WHERE role = 'user' AND is_active = true";
        } else if (audience === "staff") {
            userQuery = "SELECT user_id, email, name FROM users WHERE role != 'user' AND is_active = true";
        } else {
            return NextResponse.json({ success: false, message: "Invalid audience type" }, { status: 400 });
        }

        const targetUsersRes = await dbQuery(userQuery);
        const targetUsers = targetUsersRes.rows;

        if (targetUsers.length === 0) {
            return NextResponse.json({ success: false, message: "No users found in this group" }, { status: 404 });
        }

        // Insert notifications in bulk
        await transaction(async (client) => {
            const values = targetUsers.map((u, i) => `($1, $2, $3)`).join(', ');
            // We need to flatten the params: title, message, then all user_ids? No, format: (user_id, title, message)
            // Safer way for variable length:
            const params = [];
            const valueStrings = [];
            let i = 1;
            for (const u of targetUsers) {
                valueStrings.push(`($${i++}, $${i++}, $${i++})`);
                params.push(u.user_id, subject, message);
            }
            
            await client.query(`
                INSERT INTO notifications (user_id, title, message)
                VALUES ${valueStrings.join(', ')}
            `, params);
        });

        let emailSentCount = 0;
        
        // Optionally send emails
        if (sendEmailCopy) {
            // Using Promise.allSettled to prevent one failed email from breaking the rest
            const emailPromises = targetUsers.map(user => {
                const htmlContent = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #333;">${subject}</h2>
                        <p style="color: #555; white-space: pre-wrap; line-height: 1.5;">${message}</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                        <p style="color: #999; font-size: 12px;">This is an automated broadcast message from Disibin.</p>
                    </div>
                `;
                return sendEmail({ to: user.email, subject, htmlContent }).then(res => {
                    if (res.success) emailSentCount++;
                });
            });

            await Promise.allSettled(emailPromises);
        }

        return NextResponse.json({ 
            success: true, 
            message: "Broadcast sent successfully", 
            data: { 
                notifiedCount: targetUsers.length,
                emailSentCount: sendEmailCopy ? emailSentCount : 0
            } 
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
