import { NextResponse } from 'next/server';
import { dbQuery, transaction } from '@/lib/database/pg';
import { isManager } from '@/lib/middleware';

export async function POST(req) {
    try {
        const auth = await isManager();
        if (!auth.success) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const { purchaseId, status } = await req.json();

        if (!purchaseId || !status) {
            return NextResponse.json({ success: false, message: 'Purchase ID and status required' }, { status: 400 });
        }

        const result = await transaction(async (client) => {
            const purchaseRes = await client.query("SELECT * FROM purchases WHERE purchase_id = $1", [purchaseId]);
            if (purchaseRes.rows.length === 0) throw new Error("Purchase record not found");

            const paymentRes = await client.query("SELECT * FROM payments WHERE purchase_id = $1 ORDER BY created_at DESC LIMIT 1", [purchaseId]);
            const payment = paymentRes.rows[0];

            if (status === 'completed') {
                if (payment && payment.status !== 'completed') {
                    throw new Error("Cannot set to completed. Payment must be verified first.");
                }
            } else if (status === 'cancelled') {
                if (payment) {
                    await client.query("UPDATE payments SET status = 'failed', updated_at = NOW() WHERE payment_id = $1", [payment.payment_id]);
                }
            }

            const updateRes = await client.query("UPDATE purchases SET status = $1, updated_at = NOW() WHERE purchase_id = $2 RETURNING *", [status, purchaseId]);
            return updateRes.rows[0];
        });

        return NextResponse.json({ success: true, message: `Status successfully changed to ${status}`, data: { ...result, id: result.purchase_id, _id: result.purchase_id } });

    } catch (error) {
        if (error.message === 'Purchase record not found') {
            return NextResponse.json({ success: false, message: error.message }, { status: 404 });
        } else if (error.message === 'Cannot set to completed. Payment must be verified first.') {
            return NextResponse.json({ success: false, message: error.message }, { status: 400 });
        }
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
