import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isLogin, isManager } from "@/lib/middleware";

export async function GET() {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        const user = auth.data;

        const res = await dbQuery(`
            SELECT s.*, pkg.name as package_name, pkg.duration_days as duration_days,
                   (SELECT json_agg(f.name) 
                    FROM package_features pf 
                    JOIN features f ON pf.feature_id = f.feature_id 
                    WHERE pf.package_id = pkg.package_id) as features
            FROM subscriptions s
            LEFT JOIN packages pkg ON s.package_id = pkg.package_id
            WHERE s.user_id = $1 
            ORDER BY s.created_at DESC
        `, [user.id]);
        
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
        const res = await dbQuery("DELETE FROM subscriptions WHERE subscription_id = $1 AND user_id = $2 RETURNING *", [id, user.id]);
        
        if (res.rows.length === 0) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

        return NextResponse.json({ success: true, message: "Subscription cancelled" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}