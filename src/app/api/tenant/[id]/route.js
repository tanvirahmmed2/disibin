import { NextResponse } from "next/server";
import { dbQuery, transaction } from "@/lib/database/pg";
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

        const result = await transaction(async (client) => {
            // 0. Get current status before update
            const currentRes = await client.query("SELECT status FROM tenants WHERE tenant_id = $1", [id]);
            if (currentRes.rows.length === 0) throw new Error("Tenant not found");
            const oldStatus = currentRes.rows[0].status;

            updateParams.push(id);
            const res = await client.query(`
                UPDATE tenants 
                SET ${updateFields.join(', ')}, updated_at = NOW()
                WHERE tenant_id = $${updateParams.length} 
                RETURNING *
            `, updateParams);

            const tenant = res.rows[0];

            // REACTIVATION LOGIC: If suspended -> active, restore refunded financial records
            if (oldStatus === 'suspended' && status === 'active') {
                // 1. Restore Subscription
                const subRes = await client.query(
                    "UPDATE subscriptions SET status = 'active', updated_at = NOW() WHERE tenant_id = $1 AND status = 'refunded' RETURNING purchase_id",
                    [id]
                );
                
                if (subRes.rows.length > 0) {
                    const purchaseIds = subRes.rows.map(r => r.purchase_id).filter(pid => pid);
                    if (purchaseIds.length > 0) {
                        // 2. Restore Purchase
                        await client.query(
                            "UPDATE purchases SET status = 'approved', updated_at = NOW() WHERE purchase_id = ANY($1) AND status = 'refunded'",
                            [purchaseIds]
                        );
                        // 3. Restore Payment
                        await client.query(
                            "UPDATE payments SET status = 'success', updated_at = NOW() WHERE purchase_id = ANY($1) AND status = 'refunded'",
                            [purchaseIds]
                        );
                    }
                }
            }

            // SYNC DOMAIN & STATUS WITH WEBSITES
            const syncFields = [];
            const syncParams = [];
            if (domain !== undefined) {
                syncParams.push(domain.trim() || null);
                syncFields.push(`domain = $${syncParams.length}`);
            }
            if (status !== undefined) {
                // Map tenant status to website status
                let webStatus = status;
                if (status === 'active') webStatus = 'active';
                if (status === 'suspended' || status === 'expired') webStatus = 'suspended';
                
                syncParams.push(webStatus);
                syncFields.push(`status = $${syncParams.length}`);
            }

            if (syncFields.length > 0) {
                syncParams.push(id);
                await client.query(
                    `UPDATE websites SET ${syncFields.join(', ')}, updated_at = NOW() WHERE tenant_id = $${syncParams.length}`,
                    syncParams
                );
            }

            return tenant;
        });

        return NextResponse.json({ success: true, message: 'Tenant and linked website domains updated', data: result });
    } catch (error) {
        if (error.message === "Tenant not found") return NextResponse.json({ success: false, message: error.message }, { status: 404 });
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const { id } = await params;

        // 1. Check if tenant is eligible for deletion (e.g., suspended or has refunded subscription)
        const tenantRes = await dbQuery("SELECT status FROM tenants WHERE tenant_id = $1", [id]);
        if (tenantRes.rows.length === 0) return NextResponse.json({ success: false, message: "Tenant not found" }, { status: 404 });

        const subRes = await dbQuery("SELECT status FROM subscriptions WHERE tenant_id = $1", [id]);
        const statuses = subRes.rows.map(r => r.status);

        // Optional: Enforcement logic — only allow if suspended or refunded
        // if (tenantRes.rows[0].status !== 'suspended' && !statuses.includes('refunded')) {
        //     return NextResponse.json({ success: false, message: "Tenant must be suspended or refunded before deletion" }, { status: 400 });
        // }

        await transaction(async (client) => {
            // Delete linked entities
            await client.query("DELETE FROM websites WHERE tenant_id = $1", [id]);
            await client.query("DELETE FROM tenant_users WHERE tenant_id = $1", [id]);
            
            // Note: We might want to keep the subscription/purchase history but unlink them, 
            // or delete them if the user explicitly wants everything gone. 
            // For now, let's just nullify the tenant_id in those tables.
            await client.query("UPDATE subscriptions SET tenant_id = NULL WHERE tenant_id = $1", [id]);
            await client.query("UPDATE purchases SET tenant_id = NULL WHERE tenant_id = $1", [id]);
            await client.query("UPDATE payments SET tenant_id = NULL WHERE tenant_id = $1", [id]);

            // Finally delete the tenant
            await client.query("DELETE FROM tenants WHERE tenant_id = $1", [id]);
        });

        return NextResponse.json({ success: true, message: 'Tenant and all associated project data deleted permanently' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
