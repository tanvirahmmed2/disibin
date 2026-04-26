import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isLogin, isManager } from "@/lib/middleware";

export async function GET(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        const user = auth.data;

        const { searchParams } = new URL(req.url);
        const fetchAll = searchParams.get('all') === 'true';

        let sql;
        let params = [];

        if (fetchAll && (user.role === 'admin' || user.role === 'manager')) {
            sql = `
                SELECT s.*, pkg.name as package_name, pkg.duration_days as duration_days,
                       u.name as user_name, u.email as user_email,
                       (SELECT json_agg(f.name) 
                        FROM package_features pf 
                        JOIN features f ON pf.feature_id = f.feature_id 
                        WHERE pf.package_id = pkg.package_id) as features
                FROM subscriptions s
                LEFT JOIN packages pkg ON s.package_id = pkg.package_id
                JOIN users u ON s.user_id = u.user_id
                ORDER BY s.created_at DESC
            `;
        } else {
            sql = `
                SELECT s.*, pkg.name as package_name, pkg.duration_days as duration_days,
                       (SELECT json_agg(f.name) 
                        FROM package_features pf 
                        JOIN features f ON pf.feature_id = f.feature_id 
                        WHERE pf.package_id = pkg.package_id) as features
                FROM subscriptions s
                LEFT JOIN packages pkg ON s.package_id = pkg.package_id
                WHERE s.user_id = $1 
                ORDER BY s.created_at DESC
            `;
            params = [user.id];
        }

        const res = await dbQuery(sql, params);
        
        return NextResponse.json({
            success: true,
            message: "Subscriptions fetched",
            data: res.rows
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        const user = auth.data;

        const { package_id, transactionId } = await req.json();
        if (!package_id || !transactionId) {
            return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
        }

        const res = await dbQuery(`
            INSERT INTO subscriptions (user_id, package_id, status, stripe_subscription_id, current_period_start)
            VALUES ($1, $2, $3, $4, NOW())
            RETURNING *
        `, [user.id, package_id, 'unpaid', transactionId]);

        return NextResponse.json({
            success: true,
            message: "Subscription created",
            data: res.rows[0]
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const { id, status } = await req.json();
        if (!id) return NextResponse.json({ success: false, message: "ID required" }, { status: 400 });

        const subRes = await dbQuery("SELECT * FROM subscriptions WHERE subscription_id = $1", [id]);
        if (subRes.rows.length === 0) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
        const subscription = subRes.rows[0];

        let expiresAt = subscription.current_period_end;
        if (status === "active" && !expiresAt) {
            const pkgRes = await dbQuery("SELECT duration_days FROM packages WHERE package_id = $1", [subscription.package_id]);
            const durationDays = pkgRes.rows[0]?.duration_days || 30;
            const now = new Date();
            expiresAt = new Date(now.setDate(now.getDate() + durationDays));
        }

        const res = await dbQuery(`
            UPDATE subscriptions 
            SET status = COALESCE($1, status), current_period_end = $2, updated_at = NOW()
            WHERE subscription_id = $3
            RETURNING *
        `, [status, expiresAt, id]);

        return NextResponse.json({
            success: true,
            message: "Updated",
            data: res.rows[0]
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        const user = auth.data;

        const { id } = await req.json();
        if (!id) return NextResponse.json({ success: false, message: "ID required" }, { status: 400 });

        // 1. Fetch the subscription to get related IDs
        const subRes = await dbQuery("SELECT * FROM subscriptions WHERE subscription_id = $1", [id]);
        if (subRes.rows.length === 0) return NextResponse.json({ success: false, message: "Subscription not found" }, { status: 404 });
        
        const sub = subRes.rows[0];

        // Access Check: ONLY Manager or Admin can delete
        const isStaff = user.role === 'admin' || user.role === 'manager';
        if (!isStaff) {
            return NextResponse.json({ success: false, message: "Only managers can delete subscriptions" }, { status: 403 });
        }

        if (isStaff) {
            // FULL CASCADING DELETE for Staff
            const { tenant_id, purchase_id } = sub;

            // Use transaction for atomic operation
            await dbQuery("BEGIN");
            try {
                // Delete websites
                if (tenant_id) {
                    await dbQuery("DELETE FROM websites WHERE tenant_id = $1", [tenant_id]);
                    await dbQuery("DELETE FROM tenant_users WHERE tenant_id = $1", [tenant_id]);
                }

                // Delete payments linked to the purchase
                if (purchase_id) {
                    await dbQuery("DELETE FROM payments WHERE purchase_id = $1", [purchase_id]);
                }

                // Delete the subscription itself
                await dbQuery("DELETE FROM subscriptions WHERE subscription_id = $1", [id]);

                // Delete the purchase
                if (purchase_id) {
                    await dbQuery("DELETE FROM purchases WHERE purchase_id = $1", [purchase_id]);
                }

                // Finally delete the tenant
                if (tenant_id) {
                    await dbQuery("DELETE FROM tenants WHERE tenant_id = $1", [tenant_id]);
                }

                await dbQuery("COMMIT");
            } catch (err) {
                await dbQuery("ROLLBACK");
                throw err;
            }
        } else {
            // USER DELETE (Soft delete / Just record removal)
            await dbQuery("DELETE FROM subscriptions WHERE subscription_id = $1 AND user_id = $2", [id, user.id]);
        }

        return NextResponse.json({ 
            success: true, 
            message: isStaff ? "Subscription and all associated history deleted permanently" : "Subscription deleted" 
        });
    } catch (error) {
        console.error('Delete Subscription Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}