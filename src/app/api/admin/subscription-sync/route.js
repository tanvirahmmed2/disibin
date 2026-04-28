import { NextResponse } from "next/server";
import { dbQuery, transaction } from "@/lib/database/pg";
import { isAdmin } from "@/lib/middleware";

/**
 * GET /api/admin/subscription-sync
 * Scans for expired subscriptions and suspends associated tenants.
 * This should be called by a cron job periodically.
 */
export async function GET(req) {
    try {
        const auth = await isAdmin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        // 1. Find all active/past_due subscriptions that have passed their end date
        const expiredSubsRes = await dbQuery(`
            SELECT s.subscription_id, s.tenant_id, s.user_id, pkg.name as package_name
            FROM subscriptions s
            JOIN packages pkg ON s.package_id = pkg.package_id
            WHERE s.status IN ('active', 'past_due', 'trialing')
              AND s.current_period_end < NOW()
              AND s.is_lifetime = false
        `);

        const expiredSubs = expiredSubsRes.rows;
        const results = {
            total_processed: expiredSubs.length,
            suspended_tenants: [],
            errors: []
        };

        if (expiredSubs.length > 0) {
            for (const sub of expiredSubs) {
                try {
                    await transaction(async (client) => {
                        // Update Subscription Status
                        await client.query(
                            "UPDATE subscriptions SET status = 'expired', updated_at = NOW() WHERE subscription_id = $1",
                            [sub.subscription_id]
                        );

                        // Suspend Tenant if it exists
                        if (sub.tenant_id) {
                            await client.query(
                                "UPDATE tenants SET status = 'expired', updated_at = NOW() WHERE tenant_id = $1",
                                [sub.tenant_id]
                            );
                            
                            // Also suspend websites
                            await client.query(
                                "UPDATE websites SET status = 'suspended', updated_at = NOW() WHERE tenant_id = $1",
                                [sub.tenant_id]
                            );
                        }

                        // Notify User
                        await client.query(`
                            INSERT INTO notifications (user_id, title, message, link)
                            VALUES ($1, $2, $3, $4)
                        `, [
                            sub.user_id,
                            'Subscription Expired',
                            `Your subscription for "${sub.package_name}" has expired and your workspace has been suspended. Please renew to restore access.`,
                            '/dashboard/user/subscription'
                        ]);
                    });
                    results.suspended_tenants.push(sub.subscription_id);
                } catch (err) {
                    results.errors.push({ sub_id: sub.subscription_id, error: err.message });
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: `Processed ${expiredSubs.length} expired subscriptions`,
            data: results
        });

    } catch (error) {
        console.error('Subscription Sync Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
