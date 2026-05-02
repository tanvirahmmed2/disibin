import { NextResponse } from "next/server";
import { isLogin } from "@/lib/middleware";
import { dbQuery } from "@/lib/database/pg";

export async function GET() {
    try {
        const auth = await isLogin();
        
        if (!auth.success) {
            return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        }

        const userRes = await dbQuery("SELECT * FROM users WHERE user_id = $1", [auth.data.id]);
        if (userRes.rows.length === 0) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }
        
        const user = userRes.rows[0];
        const { password, ...userData } = user;
        
        // Ensure tenant_id is included
        userData.tenant_id = auth.data.tenantId;

        // Auto-suspend expired subscriptions/tenants/websites for Users
        if (userData.role === 'user') {
            try {
                const now = new Date();
                // 1. Mark subscriptions as past_due
                await dbQuery(`
                    UPDATE subscriptions 
                    SET status = 'past_due', updated_at = NOW()
                    WHERE user_id = $1 AND current_period_end < $2 AND status = 'active'
                `, [user.user_id, now]);

                // 2. Mark tenants as expired
                await dbQuery(`
                    UPDATE tenants
                    SET status = 'expired', updated_at = NOW()
                    WHERE owner_id = $1 AND tenant_id IN (
                        SELECT tenant_id FROM subscriptions WHERE user_id = $1 AND current_period_end < $2
                    ) AND status = 'active'
                `, [user.user_id, now]);

                // 3. Mark websites as suspended
                await dbQuery(`
                    UPDATE websites
                    SET status = 'suspended', updated_at = NOW()
                    WHERE tenant_id IN (
                        SELECT tenant_id FROM tenants WHERE owner_id = $1 AND status = 'expired'
                    ) AND status != 'suspended'
                `, [user.user_id]);

                const alertRes = await dbQuery(
                    "SELECT COUNT(*) as count FROM subscriptions WHERE user_id = $1 AND status IN ('past_due', 'suspended', 'expired')",
                    [user.user_id]
                );
                userData.hasPastDue = parseInt(alertRes.rows[0].count) > 0;
            } catch (syncErr) {
                console.error('Failed to sync expiration status:', syncErr);
            }
        }

        return NextResponse.json({
            success: true,
            message: 'User is authenticated',
            data: userData
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
