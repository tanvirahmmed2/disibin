import { NextResponse } from "next/server";
import { isTeamLogin } from "@/lib/auth/team";
import { dbQuery } from "@/lib/database/pg";

// GET — Fetch system activity logs (Team staff only)
export async function GET(req) {
    try {
        const auth = await isTeamLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search')?.trim() || '';

        let query = `
            SELECT l.id, l.team_id, l.action, l.entity_type, l.entity_id, l.description, l.created_at,
                   t.name as team_name, t.email as team_email, t.role as team_role
            FROM activity_logs l
            LEFT JOIN teams t ON l.team_id = t.id
        `;
        const params = [];

        if (search) {
            query += " WHERE l.action ILIKE $1 OR l.description ILIKE $1 OR t.name ILIKE $1 OR t.email ILIKE $1";
            params.push(`%${search}%`);
        }

        query += " ORDER BY l.created_at DESC LIMIT 200";

        const res = await dbQuery(query, params);

        return NextResponse.json({
            success: true,
            data: res.rows
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
