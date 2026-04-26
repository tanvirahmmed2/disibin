import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isManager } from "@/lib/middleware";

// PATCH /api/website/[id] — update a website's name, domain, status
export async function PATCH(req, { params }) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const { id } = await params;
        const body = await req.json();
        const { name, domain, status, theme } = body;

        const validStatuses = ['active', 'development', 'maintenance', 'suspended'];
        if (status && !validStatuses.includes(status)) {
            return NextResponse.json({ success: false, message: "Invalid status" }, { status: 400 });
        }

        const updateFields = [];
        const updateParams = [];

        if (name !== undefined) { updateParams.push(name.trim() || null); updateFields.push(`name = $${updateParams.length}`); }
        if (domain !== undefined) { updateParams.push(domain.trim() || null); updateFields.push(`domain = $${updateParams.length}`); }
        if (status !== undefined) { updateParams.push(status); updateFields.push(`status = $${updateParams.length}`); }
        if (theme !== undefined) { updateParams.push(theme.trim() || null); updateFields.push(`theme = $${updateParams.length}`); }

        if (updateFields.length === 0) {
            return NextResponse.json({ success: false, message: "No fields to update" }, { status: 400 });
        }

        updateParams.push(id);
        const res = await dbQuery(`
            UPDATE websites 
            SET ${updateFields.join(', ')}, updated_at = NOW()
            WHERE website_id = $${updateParams.length}
            RETURNING *
        `, updateParams);

        if (res.rows.length === 0) return NextResponse.json({ success: false, message: "Website not found" }, { status: 404 });

        return NextResponse.json({ success: true, message: 'Website updated', data: res.rows[0] });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST /api/website — create a new website for a tenant
export async function POST(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const { tenant_id, name, domain, status } = await req.json();

        if (!tenant_id) {
            return NextResponse.json({ success: false, message: "tenant_id is required" }, { status: 400 });
        }

        const res = await dbQuery(`
            INSERT INTO websites (tenant_id, name, domain, status)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `, [tenant_id, name || null, domain || null, status || 'development']);

        return NextResponse.json({ success: true, message: 'Website created', data: res.rows[0] });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE /api/website — delete a website
export async function DELETE(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const { id } = await req.json();

        const res = await dbQuery("DELETE FROM websites WHERE website_id = $1 RETURNING *", [id]);
        if (res.rows.length === 0) return NextResponse.json({ success: false, message: "Website not found" }, { status: 404 });

        return NextResponse.json({ success: true, message: 'Website deleted' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
