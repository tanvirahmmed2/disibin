import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isTeamLogin } from "@/lib/auth/team";

// GET — List all support tickets for team members
export async function GET() {
    try {
        const auth = await isTeamLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const query = `
            SELECT 
                t.id, 
                t.title, 
                t.created_at, 
                t.updated_at,
                (
                    SELECT message FROM ticket_messages tm 
                    WHERE tm.ticket_id = t.id 
                    ORDER BY tm.created_at DESC LIMIT 1
                ) AS last_message,
                (
                    SELECT created_at FROM ticket_messages tm 
                    WHERE tm.ticket_id = t.id 
                    ORDER BY tm.created_at DESC LIMIT 1
                ) AS last_message_at,
                (
                    SELECT u.name FROM ticket_participants tp 
                    JOIN users u ON tp.user_id = u.id 
                    WHERE tp.ticket_id = t.id LIMIT 1
                ) AS user_name,
                (
                    SELECT u.email FROM ticket_participants tp 
                    JOIN users u ON tp.user_id = u.id 
                    WHERE tp.ticket_id = t.id LIMIT 1
                ) AS user_email
            FROM tickets t
            ORDER BY t.updated_at DESC
        `;

        const res = await dbQuery(query);
        return NextResponse.json({ success: true, data: res.rows });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
