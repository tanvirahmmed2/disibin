import { NextResponse } from "next/server";
import { isTeamLogin } from "@/lib/auth/team";
import { dbQuery } from "@/lib/database/pg";

// GET — List all projects for staff members
export async function GET(req) {
    try {
        const auth = await isTeamLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status')?.trim() || '';
        const search = searchParams.get('search')?.trim() || '';

        let query = `
            SELECT p.id, p.title, p.product_id, p.user_id, p.team_id, p.status, p.created_at, p.updated_at,
                   prod.name as product_name, prod.slug as product_slug,
                   u.name as user_name, u.email as user_email,
                   t.name as team_name
            FROM projects p
            LEFT JOIN products prod ON p.product_id = prod.id
            LEFT JOIN users u ON p.user_id = u.id
            LEFT JOIN teams t ON p.team_id = t.id
        `;
        const params = [];
        const conditions = [];

        if (status && status !== 'all') {
            params.push(status);
            conditions.push(`p.status = $${params.length}`);
        }

        if (search) {
            params.push(`%${search}%`);
            conditions.push(`(p.title ILIKE $${params.length} OR u.name ILIKE $${params.length} OR u.email ILIKE $${params.length} OR prod.name ILIKE $${params.length})`);
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }

        query += " ORDER BY p.updated_at DESC";

        const res = await dbQuery(query, params);

        return NextResponse.json({ success: true, data: res.rows });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
