import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isManager } from "@/lib/middleware";

/**
 * GET /api/refund?email=...
 * Returns active subscriptions + purchase/payment data for a given user email.
 */
export async function GET(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');
        if (!email) return NextResponse.json({ success: false, message: "email param required" }, { status: 400 });

        // Fetch user
        const userRes = await dbQuery(
            "SELECT user_id, name, email FROM users WHERE email = $1",
            [email]
        );
        if (userRes.rows.length === 0) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }
        const user = userRes.rows[0];

        // Fetch active subscriptions with full purchase + payment details
        const subsRes = await dbQuery(`
            SELECT
                s.subscription_id,
                s.status            AS sub_status,
                s.current_period_start,
                s.current_period_end,
                s.is_lifetime,
                s.tenant_id,
                pkg.name            AS package_name,
                pkg.duration_days,
                t.name              AS tenant_name,
                p.purchase_id,
                p.final_amount,
                p.original_amount,
                p.discount_amount,
                p.created_at        AS purchase_date,
                pay.payment_id,
                pay.amount          AS paid_amount,
                pay.method          AS payment_method,
                pay.transaction_id,
                pay.status          AS payment_status
            FROM subscriptions s
            LEFT JOIN packages  pkg ON s.package_id  = pkg.package_id
            LEFT JOIN tenants   t   ON s.tenant_id   = t.tenant_id
            LEFT JOIN purchases p   ON s.purchase_id  = p.purchase_id
            LEFT JOIN payments  pay ON p.purchase_id  = pay.purchase_id
            WHERE s.user_id = $1
              AND s.status  IN ('active', 'past_due', 'trialing')
            ORDER BY s.created_at DESC
        `, [user.user_id]);

        return NextResponse.json({
            success: true,
            data: { user, subscriptions: subsRes.rows }
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

/**
 * POST /api/refund
 * Processes a full refund for a subscription:
 *   1. Creates refund record
 *   2. Marks payment as refunded
 *   3. Marks purchase as refunded
 *   4. Cancels subscription
 *   5. Deletes websites → tenant_users → tenant
 */
export async function POST(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const { subscription_id, payment_id, refund_amount, reason } = await req.json();

        if (!subscription_id || !payment_id || !refund_amount) {
            return NextResponse.json({
                success: false,
                message: "subscription_id, payment_id, and refund_amount are required"
            }, { status: 400 });
        }

        // 1. Verify subscription exists
        const subRes = await dbQuery(
            "SELECT * FROM subscriptions WHERE subscription_id = $1",
            [subscription_id]
        );
        if (subRes.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Subscription not found" }, { status: 404 });
        }
        const sub = subRes.rows[0];

        // 2. Create refund record (status = approved since manager is doing it directly)
        await dbQuery(`
            INSERT INTO refunds (payment_id, amount, status, reason)
            VALUES ($1, $2, 'approved', $3)
        `, [payment_id, refund_amount, reason || 'Manager-initiated refund']);

        // 3. Mark payment as refunded
        await dbQuery(
            "UPDATE payments SET status = 'refunded', updated_at = NOW() WHERE payment_id = $1",
            [payment_id]
        );

        // 4. Mark purchase as refunded
        if (sub.purchase_id) {
            await dbQuery(
                "UPDATE purchases SET status = 'refunded', updated_at = NOW() WHERE purchase_id = $1",
                [sub.purchase_id]
            );
        }

        // 5. Mark the subscription as refunded
        await dbQuery(
            "UPDATE subscriptions SET status = 'refunded', updated_at = NOW() WHERE subscription_id = $1",
            [subscription_id]
        );

        // 6. Cleanup tenant (websites → tenant_users → tenant)
        if (sub.tenant_id) {
            await dbQuery("DELETE FROM websites     WHERE tenant_id = $1", [sub.tenant_id]);
            await dbQuery("DELETE FROM tenant_users WHERE tenant_id = $1", [sub.tenant_id]);
            await dbQuery("DELETE FROM tenants      WHERE tenant_id = $1", [sub.tenant_id]);
        }

        // 7. Log the action
        await dbQuery(`
            INSERT INTO logs (user_id, action, entity_type, entity_id, description)
            VALUES ($1, 'refund', 'subscription', $2, $3)
        `, [
            auth.data.id,
            subscription_id,
            `Refund of ৳${refund_amount} for subscription #${subscription_id}. Reason: ${reason || 'N/A'}`
        ]);

        return NextResponse.json({
            success: true,
            message: `Refund of ৳${refund_amount} processed. Subscription cancelled and workspace deleted.`
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
