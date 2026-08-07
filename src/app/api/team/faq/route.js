import { NextResponse } from "next/server";
import { isTeamLogin, isManager } from "@/lib/auth/team";
import { dbQuery } from "@/lib/database/pg";

// GET — List all FAQ entries (Team login required)
export async function GET() {
    try {
        const auth = await isTeamLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const res = await dbQuery(`
            SELECT f.id, f.question, f.answer, f.is_published, f.order_num,
                   f.created_at, f.updated_at,
                   t1.name as creator_name, t2.name as updater_name
            FROM faqs f
            LEFT JOIN teams t1 ON f.created_by = t1.id
            LEFT JOIN teams t2 ON f.updated_by = t2.id
            ORDER BY f.order_num ASC, f.id ASC
        `);

        return NextResponse.json({ success: true, data: res.rows });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST — Create FAQ (Manager Only)
export async function POST(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const body = await req.json();
        const { question, answer, is_published, order_num } = body;

        if (!question || !question.trim()) {
            return NextResponse.json({ success: false, message: "Question is required" }, { status: 400 });
        }
        if (!answer || !answer.trim()) {
            return NextResponse.json({ success: false, message: "Answer is required" }, { status: 400 });
        }

        const publishedState = is_published !== undefined ? Boolean(is_published) : true;
        const orderVal = Number(order_num) || 0;

        const res = await dbQuery(`
            INSERT INTO faqs (question, answer, is_published, order_num, created_by, updated_by)
            VALUES ($1, $2, $3, $4, $5, $5)
            RETURNING *
        `, [question.trim(), answer.trim(), publishedState, orderVal, auth.data.id]);

        const record = res.rows[0];

        // Audit Log
        await dbQuery(`
            INSERT INTO activity_logs (team_id, action, entity_type, entity_id, description)
            VALUES ($1, 'FAQ_CREATE', 'faqs', $2, $3)
        `, [auth.data.id, record.id, `Created FAQ "${record.question}"`]).catch(() => {});

        return NextResponse.json({ success: true, message: "FAQ created successfully", data: record }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PUT — Update FAQ (Manager Only)
export async function PUT(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const body = await req.json();
        const { id, question, answer, is_published, order_num } = body;

        if (!id) {
            return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
        }

        const res = await dbQuery(`
            UPDATE faqs
            SET question = COALESCE(NULLIF($1, ''), question),
                answer = COALESCE(NULLIF($2, ''), answer),
                is_published = COALESCE($3, is_published),
                order_num = COALESCE($4, order_num),
                updated_by = $5,
                updated_at = now()
            WHERE id = $6
            RETURNING *
        `, [
            question?.trim() || '',
            answer?.trim() || '',
            is_published !== undefined ? Boolean(is_published) : null,
            order_num !== undefined ? Number(order_num) : null,
            auth.data.id,
            id
        ]);

        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: "FAQ record not found" }, { status: 404 });
        }

        const record = res.rows[0];

        // Audit Log
        await dbQuery(`
            INSERT INTO activity_logs (team_id, action, entity_type, entity_id, description)
            VALUES ($1, 'FAQ_UPDATE', 'faqs', $2, $3)
        `, [auth.data.id, record.id, `Updated FAQ "${record.question}"`]).catch(() => {});

        return NextResponse.json({ success: true, message: "FAQ updated successfully", data: record });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE — Delete FAQ (Manager Only)
export async function DELETE(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
        }

        const res = await dbQuery("DELETE FROM faqs WHERE id = $1 RETURNING *", [id]);

        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: "FAQ record not found" }, { status: 404 });
        }

        const deleted = res.rows[0];

        // Audit Log
        await dbQuery(`
            INSERT INTO activity_logs (team_id, action, entity_type, entity_id, description)
            VALUES ($1, 'FAQ_DELETE', 'faqs', $2, $3)
        `, [auth.data.id, deleted.id, `Deleted FAQ "${deleted.question}"`]).catch(() => {});

        return NextResponse.json({ success: true, message: "FAQ deleted successfully", data: deleted });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
