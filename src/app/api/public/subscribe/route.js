import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";

export async function POST(req) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email || typeof email !== 'string' || !email.trim()) {
            return NextResponse.json(
                { success: false, message: "Please enter a valid email address" },
                { status: 400 }
            );
        }

        const cleanEmail = email.trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(cleanEmail)) {
            return NextResponse.json(
                { success: false, message: "Please enter a valid email address format" },
                { status: 400 }
            );
        }

        // Check if email already exists in client_leads
        const checkRes = await dbQuery(
            "SELECT id FROM client_leads WHERE LOWER(email) = $1",
            [cleanEmail]
        );

        if (checkRes.rows.length > 0) {
            return NextResponse.json(
                { success: false, message: "You are already subscribed to our newsletter!" },
                { status: 400 }
            );
        }

        // Extract name from the part before '@'
        const rawPrefix = cleanEmail.split('@')[0] || 'Subscriber';
        // Capitalize first letter
        const extractedName = rawPrefix.charAt(0).toUpperCase() + rawPrefix.slice(1);

        const insertRes = await dbQuery(
            `INSERT INTO client_leads (name, email, note)
             VALUES ($1, $2, $3)
             RETURNING id, name, email, note, created_at`,
            [extractedName, cleanEmail, "Subscribed via Website Footer Newsletter"]
        );

        const newLead = insertRes.rows[0];

        // Log activity
        await dbQuery(
            `INSERT INTO activity_logs (team_id, action, entity_type, entity_id, description)
             VALUES (NULL, 'NEWSLETTER_SUBSCRIBE', 'client_lead', $1, $2)`,
            [newLead.id, `New website subscriber: ${cleanEmail}`]
        ).catch(() => {});

        return NextResponse.json(
            {
                success: true,
                message: "Thank you for subscribing to our newsletter!",
                data: newLead
            },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message || "Failed to subscribe" },
            { status: 500 }
        );
    }
}
