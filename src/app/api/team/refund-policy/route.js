import { NextResponse } from "next/server";
import { isTeamLogin, isManager } from "@/lib/auth/team";
import { dbQuery } from "@/lib/database/pg";

// GET — List all refund condition entries (Team login required)
export async function GET() {
    try {
        const auth = await isTeamLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const res = await dbQuery(`
            SELECT r.id, r.title, r.content, r.is_published, r.order_num, r.created_at, r.updated_at,
                   t1.name as creator_name, t2.name as updater_name
            FROM refund_conditions r
            LEFT JOIN teams t1 ON r.created_by = t1.id
            LEFT JOIN teams t2 ON r.updated_by = t2.id
            ORDER BY r.order_num ASC, r.id ASC
        `);

        return NextResponse.json({ success: true, data: res.rows });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST — Create Refund Condition Item (Manager Only)
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
            INSERT INTO refund_conditions (title, content, is_published, order_num, created_by, updated_by)
            VALUES ($1, $2, $3, $4, $5, $5)
            RETURNING *
        `, [title.trim(), content.trim(), publishedState, orderVal, auth.data.id]);

        const record = res.rows[0];

        // Audit Log
        await dbQuery(`
            INSERT INTO activity_logs (team_id, action, entity_type, entity_id, description)
            VALUES ($1, 'REFUND_POLICY_CREATE', 'refund_conditions', $2, $3)
        `, [auth.data.id, record.id, `Created Refund Policy item "${record.title}"`]).catch(() => {});

        return NextResponse.json({ success: true, message: "Refund Policy item created successfully", data: record }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PUT — Update Refund Condition Item (Manager Only)
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
            UPDATE refund_conditions
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
            return NextResponse.json({ success: false, message: "Refund Policy record not found" }, { status: 404 });
        }

        const record = res.rows[0];

        // Audit Log
        await dbQuery(`
            INSERT INTO activity_logs (team_id, action, entity_type, entity_id, description)
            VALUES ($1, 'REFUND_POLICY_UPDATE', 'refund_conditions', $2, $3)
        `, [auth.data.id, record.id, `Updated Refund Policy item "${record.title}"`]).catch(() => {});

        return NextResponse.json({ success: true, message: "Refund Policy updated successfully", data: record });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE — Delete Refund Condition Item (Manager Only)
export async function DELETE(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
        }

        const res = await dbQuery("DELETE FROM refund_conditions WHERE id = $1 RETURNING *", [id]);

        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Refund Policy record not found" }, { status: 404 });
        }

        const deleted = res.rows[0];

        // Audit Log
        await dbQuery(`
            INSERT INTO activity_logs (team_id, action, entity_type, entity_id, description)
            VALUES ($1, 'REFUND_POLICY_DELETE', 'refund_conditions', $2, $3)
        `, [auth.data.id, deleted.id, `Deleted Refund Policy item "${deleted.title}"`]).catch(() => {});

        return NextResponse.json({ success: true, message: "Refund Policy item deleted successfully", data: deleted });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
