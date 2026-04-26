import { NextResponse } from "next/server";
import { dbQuery, transaction } from "@/lib/database/pg";
import { isManager } from "@/lib/middleware";

export async function GET(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');
        const method = searchParams.get('method');
        const limit = parseInt(searchParams.get('limit') || '200');

        let conditions = [];
        let params = [];

        if (status) { params.push(status); conditions.push(`pay.status = $${params.length}`); }
        if (method) { params.push(method); conditions.push(`pay.method = $${params.length}`); }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        const res = await dbQuery(`
            SELECT 
                pay.*,
                u.name  as user_name, u.email as user_email,
                pkg.name as package_name,
                p.status as purchase_status, p.discount_amount, p.coupon_id
            FROM payments pay
            LEFT JOIN users    u   ON pay.user_id    = u.user_id
            LEFT JOIN purchases p  ON pay.purchase_id = p.purchase_id
            LEFT JOIN packages pkg ON p.package_id    = pkg.package_id
            ${whereClause}
            ORDER BY pay.created_at DESC
            LIMIT $${params.length + 1}
        `, [...params, limit]);

        const totals = await dbQuery(`
            SELECT 
                COUNT(*)                                        as total_count,
                COALESCE(SUM(CASE WHEN status = 'success'  THEN amount END), 0) as total_success,
                COALESCE(SUM(CASE WHEN status = 'pending'  THEN amount END), 0) as total_pending,
                COALESCE(SUM(CASE WHEN status = 'failed'   THEN amount END), 0) as total_failed,
                COALESCE(SUM(CASE WHEN status = 'refunded' THEN amount END), 0) as total_refunded
            FROM payments
        `);

        return NextResponse.json({
            success: true,
            message: 'Payments fetched',
            data: res.rows,
            summary: totals.rows[0]
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const { id, status } = await req.json();
        if (!id || !status) return NextResponse.json({ success: false, message: "id and status required" }, { status: 400 });

        const validStatuses = ['success', 'failed', 'refunded'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ success: false, message: "Invalid status" }, { status: 400 });
        }

        const paidAt = status === 'success' ? 'NOW()' : 'NULL';

        const res = await dbQuery(`
            UPDATE payments 
            SET status = $1, paid_at = ${paidAt}, updated_at = NOW()
            WHERE payment_id = $2
            RETURNING *
        `, [status, id]);

        if (res.rows.length === 0) return NextResponse.json({ success: false, message: "Payment not found" }, { status: 404 });

        // If approving, also mark the purchase as approved
        if (status === 'success') {
            await dbQuery(
                "UPDATE purchases SET status = 'approved', updated_at = NOW() WHERE purchase_id = $1",
                [res.rows[0].purchase_id]
            );
        }

        return NextResponse.json({ success: true, message: `Payment marked as ${status}`, data: res.rows[0] });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { purchaseId, amount, paymentMethod, transactionId } = body;

        if (!purchaseId || !amount) {
            return NextResponse.json({ success: false, message: "Purchase ID and amount are required" }, { status: 400 });
        }

        const result = await transaction(async (client) => {
            const payRes = await client.query(`
                INSERT INTO payments (purchase_id, amount, method, status, transaction_id, paid_at)
                VALUES ($1, $2, $3, 'success', $4, NOW())
                RETURNING *
            `, [purchaseId, amount, paymentMethod, transactionId]);

            await client.query(`
                UPDATE purchases SET status = 'completed', updated_at = NOW() WHERE purchase_id = $1
            `, [purchaseId]);

            return payRes.rows[0];
        });

        return NextResponse.json({ 
            success: true, 
            message: 'Payment processed successfully', 
            data: { ...result, id: result.payment_id, _id: result.payment_id } 
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
