import { NextResponse } from "next/server";
import { isSupport } from "@/lib/middleware";
import { dbQuery } from "@/lib/database/pg";

// GET all support requests (Support role only)
export async function GET(req) {
    try {
        const auth = await isSupport();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const res = await dbQuery(`
            SELECT s.*, u.name as responder_name
            FROM supports s
            LEFT JOIN users u ON s.responded_by = u.user_id
            ORDER BY s.created_at DESC
        `);

        return NextResponse.json({ success: true, data: res.rows });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST create support request (Public)
export async function POST(req) {
    try {
        const body = await req.json();
        const { name, email, subject, description } = body;

        if (!name || !email || !subject || !description) {
            return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
        }

        const query = `
            INSERT INTO supports (name, email, subject, description)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const res = await dbQuery(query, [name, email, subject, description]);

        return NextResponse.json({
            success: true,
            message: "Support request submitted successfully",
            data: res.rows[0]
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
