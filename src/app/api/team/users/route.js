import { NextResponse } from "next/server";
import { isTeamLogin } from "@/lib/auth/team";
import { dbQuery } from "@/lib/database/pg";

// GET — Fetch all registered users or search by email/name (Team staff only)
export async function GET(req) {
    try {
        const auth = await isTeamLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search')?.trim() || '';
        const email = searchParams.get('email')?.trim() || '';

        let query = `
            SELECT id, name, email, phone, city, country, is_verified, created_at
            FROM users
        `;
        const params = [];

        if (email) {
            query += " WHERE LOWER(email) = LOWER($1)";
            params.push(email);
        } else if (search) {
            query += " WHERE name ILIKE $1 OR email ILIKE $1 OR phone ILIKE $1";
            params.push(`%${search}%`);
        }

        query += " ORDER BY created_at DESC";

        const res = await dbQuery(query, params);

        return NextResponse.json({
            success: true,
            data: res.rows
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
