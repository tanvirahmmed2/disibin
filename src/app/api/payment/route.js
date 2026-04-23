import { NextResponse } from "next/server";
import { dbQuery, transaction } from "@/lib/database/pg";

export async function POST(req) {
    try {
        const body = await req.json();
        const { purchaseId, amount, paymentMethod, transactionId } = body;

        if (!purchaseId || !amount) {
            return NextResponse.json({ success: false, message: "Purchase ID and amount are required" }, { status: 400 });
        }

        const result = await transaction(async (client) => {
            const payRes = await client.query(`
                INSERT INTO payments (purchase_id, amount, method, status, success, transaction_id, paid_at)
                VALUES ($1, $2, $3, 'completed', true, $4, NOW())
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
