import { NextResponse } from "next/server";
import { isTeamLogin } from "@/lib/auth/team";
import { dbQuery } from "@/lib/database/pg";

// GET — Fetch internal team login audit logs (Team staff only)
export async function GET(req) {
    try {
        const auth = await isTeamLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search')?.trim() || '';
        const status = searchParams.get('status')?.trim() || '';

        let query = `
            SELECT l.id, l.team_id, l.action, l.description, l.status, l.created_at,
                   t.name as team_name, t.email as team_email, t.role as team_role
            FROM team_login_logs l
            LEFT JOIN teams t ON l.team_id = t.id
        `;
        const params = [];
        const conditions = [];

        if (status && status !== 'all') {
            params.push(status);
            conditions.push(`l.status = $${params.length}`);
        }

        if (search) {
            params.push(`%${search}%`);
            conditions.push(`(t.name ILIKE $${params.length} OR t.email ILIKE $${params.length} OR l.description ILIKE $${params.length})`);
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
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
