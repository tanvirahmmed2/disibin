import { NextResponse } from "next/server";
import { isTeamLogin, isManager } from "@/lib/auth/team";
import { dbQuery } from "@/lib/database/pg";

// GET — List all terms & conditions entries (Team login required)
export async function GET() {
    try {
        const auth = await isTeamLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const res = await dbQuery(`
            SELECT t.id, t.title, t.content, t.is_published, t.order_num, t.created_at, t.updated_at,
                   t1.name as creator_name, t2.name as updater_name
            FROM terms_and_conditions t
            LEFT JOIN teams t1 ON t.created_by = t1.id
            LEFT JOIN teams t2 ON t.updated_by = t2.id
            ORDER BY t.order_num ASC, t.id ASC
        `);

        return NextResponse.json({ success: true, data: res.rows });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST — Create Terms & Conditions Item (Manager Only)
export async function POST(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const body = await req.json();
        const { title, content, is_published, order_num } = body;

        if (!title || !title.trim()) {
            return NextResponse.json({ success: false, message: "Title is required" }, { status: 400 });
        }
        if (!content || !content.trim()) {
            return NextResponse.json({ success: false, message: "Content is required" }, { status: 400 });
        }

        const publishedState = is_published !== undefined ? Boolean(is_published) : true;
        const orderVal = Number(order_num) || 0;

        const res = await dbQuery(`
            INSERT INTO terms_and_conditions (title, content, is_published, order_num, created_by, updated_by)
            VALUES ($1, $2, $3, $4, $5, $5)
            RETURNING *
        `, [title.trim(), content.trim(), publishedState, orderVal, auth.data.id]);

        const record = res.rows[0];

        // Audit Log
        await dbQuery(`
            INSERT INTO activity_logs (team_id, action, entity_type, entity_id, description)
            VALUES ($1, 'TERMS_CONDITION_CREATE', 'terms_and_conditions', $2, $3)
        `, [auth.data.id, record.id, `Created Terms & Conditions item "${record.title}"`]).catch(() => {});

        return NextResponse.json({ success: true, message: "Terms & Conditions item created successfully", data: record }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PUT — Update Terms & Conditions Item (Manager Only)
export async function PUT(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const body = await req.json();
        const { id, title, content, is_published, order_num } = body;

        if (!id) {
            return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
        }

        const res = await dbQuery(`
            UPDATE terms_and_conditions
            SET title = COALESCE(NULLIF($1, ''), title),
                content = COALESCE(NULLIF($2, ''), content),
                is_published = COALESCE($3, is_published),
                order_num = COALESCE($4, order_num),
                updated_by = $5,
                updated_at = now()
            WHERE id = $6
            RETURNING *
        `, [
            title?.trim() || '',
            content?.trim() || '',
            is_published !== undefined ? Boolean(is_published) : null,
            order_num !== undefined ? Number(order_num) : null,
            auth.data.id,
            id
        ]);

        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Terms & Conditions record not found" }, { status: 404 });
        }

        const record = res.rows[0];

        // Audit Log
        await dbQuery(`
            INSERT INTO activity_logs (team_id, action, entity_type, entity_id, description)
            VALUES ($1, 'TERMS_CONDITION_UPDATE', 'terms_and_conditions', $2, $3)
        `, [auth.data.id, record.id, `Updated Terms & Conditions item "${record.title}"`]).catch(() => {});

        return NextResponse.json({ success: true, message: "Terms & Conditions updated successfully", data: record });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE — Delete Terms & Conditions Item (Manager Only)
export async function DELETE(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
        }

        const res = await dbQuery("DELETE FROM terms_and_conditions WHERE id = $1 RETURNING *", [id]);

        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Terms & Conditions record not found" }, { status: 404 });
        }

        const deleted = res.rows[0];

        // Audit Log
        await dbQuery(`
            INSERT INTO activity_logs (team_id, action, entity_type, entity_id, description)
            VALUES ($1, 'TERMS_CONDITION_DELETE', 'terms_and_conditions', $2, $3)
        `, [auth.data.id, deleted.id, `Deleted Terms & Conditions item "${deleted.title}"`]).catch(() => {});

        return NextResponse.json({ success: true, message: "Terms & Conditions item deleted successfully", data: deleted });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
