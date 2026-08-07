import { NextResponse } from "next/server";
import { isUserLogin } from "@/lib/auth/user";
import { dbQuery } from "@/lib/database/pg";

let tableInitialized = false;

async function ensureAgreementsTable() {
    if (tableInitialized) return;
    try {
        await dbQuery(`
            CREATE TABLE IF NOT EXISTS agreements (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                project_id INT,
                user_id INT,
                file_url TEXT NOT NULL,
                file_id TEXT,
                status VARCHAR(50) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        `);
        tableInitialized = true;
    } catch (error) {
        console.error("Failed to initialize agreements table:", error);
    }
}

// GET — Fetch agreements for customer user
export async function GET() {
    try {
        const auth = await isUserLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        await ensureAgreementsTable();

        const userId = auth.data.id;

        const res = await dbQuery(`
            SELECT a.id, a.title, a.project_id, a.file_url, a.status, a.created_at, a.updated_at,
                   p.title as project_title
            FROM agreements a
            LEFT JOIN projects p ON a.project_id = p.id
            WHERE a.user_id = $1 OR p.user_id = $1
            ORDER BY a.created_at DESC
        `, [userId]);

        return NextResponse.json({ success: true, data: res.rows });
    } catch (error) {
        console.error("GET /api/user/agreements Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PATCH — Customer user signs or rejects an agreement
export async function PATCH(req) {
    try {
        const auth = await isUserLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        await ensureAgreementsTable();

        const userId = auth.data.id;
        const { agreement_id, status } = await req.json();

        if (!agreement_id || !status) {
            return NextResponse.json({ success: false, message: "Agreement ID and Status are required" }, { status: 400 });
        }

        const validStatuses = ['signed', 'rejected'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ success: false, message: "Status must be signed or rejected" }, { status: 400 });
        }

        const res = await dbQuery(`
            UPDATE agreements
            SET status = $1, updated_at = now()
            WHERE id = $2 AND (user_id = $3 OR EXISTS (
                SELECT 1 FROM projects p WHERE p.id = agreements.project_id AND p.user_id = $3
            ))
            RETURNING *
        `, [status, agreement_id, userId]);

        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Agreement not found or access denied" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: `Agreement marked as ${status}`,
            data: res.rows[0]
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
