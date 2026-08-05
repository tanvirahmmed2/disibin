import { NextResponse } from "next/server";
import { isTeamLogin } from "@/lib/auth/team";
import { dbQuery } from "@/lib/database/pg";

// GET — Fetch all client leads (Team roles only)
export async function GET(req) {
    try {
        const auth = await isTeamLogin();
        if (!auth.success) {
            return NextResponse.json(auth, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search')?.trim() || '';

        let query = "SELECT * FROM client_leads";
        let params = [];

        if (search) {
            query += " WHERE name ILIKE $1 OR email ILIKE $1 OR phone ILIKE $1 OR note ILIKE $1";
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

// POST — Manually create a client lead (Team roles only)
export async function POST(req) {
    try {
        const auth = await isTeamLogin();
        if (!auth.success) {
            return NextResponse.json(auth, { status: 401 });
        }

        const body = await req.json();
        const { name, email, phone, address, note } = body;

        if (!name || !email) {
            return NextResponse.json(
                { success: false, message: "Client name and email are required" },
                { status: 400 }
            );
        }

        const res = await dbQuery(
            `INSERT INTO client_leads (name, email, phone, address, note)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [
                name.trim(),
                email.trim(),
                phone?.trim() || null,
                address?.trim() || null,
                note?.trim() || null
            ]
        );

        return NextResponse.json(
            {
                success: true,
                message: "Client lead created successfully",
                data: res.rows[0]
            },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
