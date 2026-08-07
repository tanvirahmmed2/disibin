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
            ALTER TABLE notifications ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'info';
            ALTER TABLE notifications ADD COLUMN IF NOT EXISTS link TEXT;
            ALTER TABLE notifications ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false;
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
            SELECT id, title, message, type, COALESCE(is_read, false) as is_read, link, created_at
            FROM notifications
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT 50
        `, [auth.data.id]).catch(() => ({ rows: [] }));

        // Seed default welcome notification into database if user has no notifications
        let notifications = res.rows;
        if (notifications.length === 0) {
            const welcomeRes = await dbQuery(`
                INSERT INTO notifications (user_id, title, message, type, is_read, link)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id, title, message, type, is_read, link, created_at
            `, [
                auth.data.id,
                "Welcome to Disibin Platform!",
                "Explore your projects, track support tickets, and view agreement documents in your dashboard.",
                "system",
                false,
                "/user/projects"
            ]).catch(() => ({ rows: [] }));

            notifications = welcomeRes.rows.length > 0 ? welcomeRes.rows : [];
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
