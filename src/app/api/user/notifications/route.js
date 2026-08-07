import { NextResponse } from "next/server";
import { isUserLogin } from "@/lib/auth/user";
import { dbQuery } from "@/lib/database/pg";

let tableInitialized = false;

async function ensureNotificationsTable() {
    if (tableInitialized) return;
    try {
        await dbQuery(`
            CREATE TABLE IF NOT EXISTS notifications (
                id SERIAL PRIMARY KEY,
                user_id INT REFERENCES users(id) ON DELETE CASCADE,
                title VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                type VARCHAR(50) DEFAULT 'info',
                is_read BOOLEAN DEFAULT false,
                link TEXT,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);
        tableInitialized = true;
    } catch (err) {
        console.error("Failed to initialize notifications table:", err);
    }
}

// GET — List user notifications
export async function GET() {
    try {
        const auth = await isUserLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        await ensureNotificationsTable();

        const res = await dbQuery(`
            SELECT id, title, message, type, is_read, link, created_at
            FROM notifications
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT 50
        `, [auth.data.id]).catch(() => ({ rows: [] }));

        // Fallback default system notification if list is empty
        let notifications = res.rows;
        if (notifications.length === 0) {
            notifications = [
                {
                    id: 1,
                    title: "Welcome to Disibin Platform!",
                    message: "Explore your projects, track support tickets, and view agreement documents in your dashboard.",
                    type: "system",
                    is_read: false,
                    link: "/user/projects",
                    created_at: new Date().toISOString()
                }
            ];
        }

        return NextResponse.json({ success: true, data: notifications });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PATCH — Mark notifications as read
export async function PATCH(req) {
    try {
        const auth = await isUserLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        await ensureNotificationsTable();

        const body = await req.json().catch(() => ({}));
        const { notification_id, mark_all } = body;

        if (mark_all) {
            await dbQuery(`
                UPDATE notifications
                SET is_read = true
                WHERE user_id = $1
            `, [auth.data.id]);

            return NextResponse.json({ success: true, message: "All notifications marked as read" });
        }

        if (notification_id) {
            await dbQuery(`
                UPDATE notifications
                SET is_read = true
                WHERE id = $1 AND user_id = $2
            `, [notification_id, auth.data.id]);

            return NextResponse.json({ success: true, message: "Notification marked as read" });
        }

        return NextResponse.json({ success: false, message: "Invalid request payload" }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
