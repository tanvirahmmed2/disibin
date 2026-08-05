import { NextResponse } from "next/server";
import { isUserLogin } from "@/lib/auth/user";
import { dbQuery } from "@/lib/database/pg";

// GET — List logged-in user's projects
export async function GET() {
    try {
        const auth = await isUserLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const userId = auth.data.id;

        const res = await dbQuery(`
            SELECT DISTINCT p.id, p.title, p.product_id, p.status, p.created_at, p.updated_at,
                   prod.name as product_name, prod.slug as product_slug,
                   (SELECT COUNT(*) FROM project_messages pm WHERE pm.project_id = p.id) as message_count
            FROM projects p
            LEFT JOIN products prod ON p.product_id = prod.id
            LEFT JOIN project_participants pp ON p.id = pp.project_id
            WHERE p.user_id = $1 OR pp.user_id = $1
            ORDER BY p.updated_at DESC
        `, [userId]);

        return NextResponse.json({ success: true, data: res.rows });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST — Create new customer project
export async function POST(req) {
    try {
        const auth = await isUserLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const userId = auth.data.id;
        const body = await req.json();
        const { title, product_id, initial_message } = body;

        if (!title || !title.trim()) {
            return NextResponse.json({ success: false, message: "Project title is required" }, { status: 400 });
        }

        // Insert project
        const projectRes = await dbQuery(`
            INSERT INTO projects (title, product_id, user_id, status)
            VALUES ($1, $2, $3, 'pending')
            RETURNING *
        `, [title.trim(), product_id || null, userId]);

        const project = projectRes.rows[0];

        // Add user to project_participants
        await dbQuery(`
            INSERT INTO project_participants (project_id, user_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING
        `, [project.id, userId]);

        // Insert initial message if provided
        if (initial_message && initial_message.trim()) {
            await dbQuery(`
                INSERT INTO project_messages (project_id, user_id, message)
                VALUES ($1, $2, $3)
            `, [project.id, userId, initial_message.trim()]);
        }

        return NextResponse.json({
            success: true,
            message: "Project created successfully!",
            data: project
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
