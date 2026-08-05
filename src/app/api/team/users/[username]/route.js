import { NextResponse } from "next/server";
import { isTeamLogin } from "@/lib/auth/team";
import { dbQuery } from "@/lib/database/pg";

// GET — Fetch detailed user profile by email or user ID (Team staff only)
export async function GET(req, { params }) {
    try {
        const auth = await isTeamLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const resolvedParams = await params;
        let paramValue = resolvedParams.username || '';
        try {
            paramValue = decodeURIComponent(paramValue);
            if (paramValue.includes('%')) {
                paramValue = decodeURIComponent(paramValue);
            }
        } catch {}
        paramValue = paramValue.trim();

        if (!paramValue) {
            return NextResponse.json({ success: false, message: "User Email or ID is required" }, { status: 400 });
        }

        // Query user by email or integer ID
        let userRes;
        const numericId = parseInt(paramValue, 10);
        if (!isNaN(numericId) && numericId.toString() === paramValue) {
            userRes = await dbQuery(`
                SELECT id, name, email, phone, city, country, is_verified, created_at
                FROM users
                WHERE id = $1
            `, [numericId]);
        } else {
            userRes = await dbQuery(`
                SELECT id, name, email, phone, city, country, is_verified, created_at
                FROM users
                WHERE LOWER(email) = LOWER($1)
            `, [paramValue]);
        }

        if (userRes.rows.length === 0) {
            return NextResponse.json({ success: false, message: "User profile not found" }, { status: 404 });
        }

        const user = userRes.rows[0];

        // Fetch user tickets via ticket_participants join
        const ticketsRes = await dbQuery(`
            SELECT DISTINCT t.id, t.title, t.created_at
            FROM tickets t
            JOIN ticket_participants tp ON t.id = tp.ticket_id
            WHERE tp.user_id = $1
            ORDER BY t.created_at DESC
        `, [user.id]).catch(() => ({ rows: [] }));

        // Fetch user reviews
        const reviewsRes = await dbQuery(`
            SELECT id, rating, comment, reply, is_approved, created_at
            FROM reviews
            WHERE user_id = $1
        `, [user.id]).catch(() => ({ rows: [] }));

        // Fetch user login logs
        const loginLogsRes = await dbQuery(`
            SELECT id, action, entity_type, description, status, created_at
            FROM user_login_logs
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT 10
        `, [user.id]).catch(() => ({ rows: [] }));

        return NextResponse.json({
            success: true,
            data: {
                user,
                tickets: ticketsRes.rows,
                reviews: reviewsRes.rows[0] || null,
                loginLogs: loginLogsRes.rows
            }
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
