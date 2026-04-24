import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isLogin, isManager } from "@/lib/middleware";

export async function GET(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        const user = auth.data;

        // Fetch notifications for the logged in user
        const res = await dbQuery(`
            SELECT * FROM notifications
            WHERE user_id = $1
            ORDER BY created_at DESC
        `, [user.id]);

        return NextResponse.json({ success: true, message: 'Notifications fetched', data: res.rows });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const { user_id, title, message, link } = await req.json();

        if (!user_id || !title || !message) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        const res = await dbQuery(`
            INSERT INTO notifications (user_id, title, message, link)
            VALUES ($1, $2, $3, $4) RETURNING *
        `, [user_id, title, message, link || null]);

        return NextResponse.json({ success: true, message: 'Notification sent', data: res.rows[0] });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        const user = auth.data;

        const { id } = await req.json();

        if (!id) {
            // Mark all as read
            await dbQuery(`UPDATE notifications SET is_read = TRUE WHERE user_id = $1`, [user.id]);
        } else {
            // Mark specific as read
            await dbQuery(`UPDATE notifications SET is_read = TRUE WHERE notification_id = $1 AND user_id = $2`, [id, user.id]);
        }

        return NextResponse.json({ success: true, message: 'Notification marked as read' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const { id } = await req.json();
        if (!id) return NextResponse.json({ success: false, message: 'Missing ID' }, { status: 400 });

        await dbQuery(`DELETE FROM notifications WHERE notification_id = $1`, [id]);

        return NextResponse.json({ success: true, message: 'Notification deleted' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
