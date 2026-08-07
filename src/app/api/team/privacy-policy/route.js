import { NextResponse } from "next/server";
import { isTeamLogin, isManager } from "@/lib/auth/team";
import { dbQuery } from "@/lib/database/pg";

// GET — List all privacy policy entries (Team login required)
export async function GET() {
    try {
        const auth = await isTeamLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const res = await dbQuery(`
            SELECT p.id, p.title, p.content, p.is_published, p.order_num, p.created_at, p.updated_at,
                   t1.name as creator_name, t2.name as updater_name
            FROM privacy_policies p
            LEFT JOIN teams t1 ON p.created_by = t1.id
            LEFT JOIN teams t2 ON p.updated_by = t2.id
            ORDER BY p.order_num ASC, p.id ASC
        `);

        return NextResponse.json({ success: true, data: res.rows });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST — Create Privacy Policy Item (Manager Only)
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
            INSERT INTO privacy_policies (title, content, is_published, order_num, created_by, updated_by)
            VALUES ($1, $2, $3, $4, $5, $5)
            RETURNING *
        `, [title.trim(), content.trim(), publishedState, orderVal, auth.data.id]);

        const record = res.rows[0];

        // Audit Log
        await dbQuery(`
            INSERT INTO activity_logs (team_id, action, entity_type, entity_id, description)
            VALUES ($1, 'PRIVACY_POLICY_CREATE', 'privacy_policy', $2, $3)
        `, [auth.data.id, record.id, `Created Privacy Policy item "${record.title}"`]).catch(() => {});

        return NextResponse.json({ success: true, message: "Privacy Policy item created successfully", data: record }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PUT — Update Privacy Policy Item (Manager Only)
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
            UPDATE privacy_policies
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
            return NextResponse.json({ success: false, message: "Privacy Policy record not found" }, { status: 404 });
        }

        const record = res.rows[0];

        // Audit Log
        await dbQuery(`
            INSERT INTO activity_logs (team_id, action, entity_type, entity_id, description)
            VALUES ($1, 'PRIVACY_POLICY_UPDATE', 'privacy_policy', $2, $3)
        `, [auth.data.id, record.id, `Updated Privacy Policy item "${record.title}"`]).catch(() => {});

        return NextResponse.json({ success: true, message: "Privacy Policy updated successfully", data: record });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE — Delete Privacy Policy Item (Manager Only)
export async function DELETE(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
        }

        const res = await dbQuery("DELETE FROM privacy_policies WHERE id = $1 RETURNING *", [id]);

        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Privacy Policy record not found" }, { status: 404 });
        }

        const deleted = res.rows[0];

        // Audit Log
        await dbQuery(`
            INSERT INTO activity_logs (team_id, action, entity_type, entity_id, description)
            VALUES ($1, 'PRIVACY_POLICY_DELETE', 'privacy_policy', $2, $3)
        `, [auth.data.id, deleted.id, `Deleted Privacy Policy item "${deleted.title}"`]).catch(() => {});

        return NextResponse.json({ success: true, message: "Privacy Policy item deleted successfully", data: deleted });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
