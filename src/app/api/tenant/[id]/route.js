import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isManager } from "@/lib/middleware";

export async function GET(req, { params }) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const { id } = await params;

        const res = await dbQuery(`
            SELECT 
                t.*, 
                u.name as owner_name, u.email as owner_email, u.phone as owner_phone,
                sub.status as subscription_status, sub.current_period_end,
                pkg.name as package_name, pkg.is_lifetime
            FROM tenants t
            LEFT JOIN users u ON t.owner_id = u.user_id
            LEFT JOIN subscriptions sub ON t.tenant_id = sub.tenant_id
            LEFT JOIN packages pkg ON sub.package_id = pkg.package_id
            WHERE t.tenant_id = $1
        `, [id]);

        if (res.rows.length === 0) return NextResponse.json({ success: false, message: "Tenant not found" }, { status: 404 });

        // Get websites for this tenant
        const webRes = await dbQuery("SELECT * FROM websites WHERE tenant_id = $1", [id]);
        
        return NextResponse.json({ 
            success: true, 
            message: 'Tenant details fetched', 
            data: { ...res.rows[0], websites: webRes.rows } 
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req, { params }) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const { id } = await params;
        const body = await req.json();
        const { status, name, domain, subdomain } = body;

        const updateFields = [];
        const updateParams = [];

        if (status !== undefined) {
            if (!['active', 'suspended', 'expired'].includes(status)) {
                return NextResponse.json({ success: false, message: "Invalid status value" }, { status: 400 });
            }
            updateParams.push(status);
            updateFields.push(`status = $${updateParams.length}`);
        }
        if (name !== undefined) {
            updateParams.push(name.trim());
            updateFields.push(`name = $${updateParams.length}`);
        }
        if (domain !== undefined) {
            updateParams.push(domain.trim() || null);
            updateFields.push(`domain = $${updateParams.length}`);
        }
        if (subdomain !== undefined) {
            updateParams.push(subdomain.trim() || null);
            updateFields.push(`subdomain = $${updateParams.length}`);
        }

        if (updateFields.length === 0) {
            return NextResponse.json({ success: false, message: "No fields to update" }, { status: 400 });
        }

        updateParams.push(id);
        const res = await dbQuery(`
            UPDATE tenants 
            SET ${updateFields.join(', ')}, updated_at = NOW()
            WHERE tenant_id = $${updateParams.length} 
            RETURNING *
        `, updateParams);

        if (res.rows.length === 0) return NextResponse.json({ success: false, message: "Tenant not found" }, { status: 404 });

        return NextResponse.json({ success: true, message: 'Tenant updated', data: res.rows[0] });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
