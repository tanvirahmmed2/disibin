import { pool } from '@/lib/database/pg';
import { isLogin } from '@/lib/middleware';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) {
            return NextResponse.json({ success: false, message: 'Please login' }, { status: 401 });
        }

        const user_id = auth.payload.user_id;
        const body = await req.json();
        const { items, totalAmount, payment_method } = body;

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const purchaseIds = [];
            // 1. Insert each item into purchased_packages
            for (const item of items) {
                const packageSql = `
                    INSERT INTO purchased_packages (user_id, package_id, package_title, amount_paid, status) 
                    VALUES ($1, $2, $3, $4, 'pending')
                    RETURNING purchase_id;
                `;
                const res = await client.query(packageSql, [user_id, item.package_id, item.title, item.price]);
                purchaseIds.push(res.rows[0].purchase_id);
            }

            // 2. Insert payment record (linking to the first purchase_id as a reference)
            const transaction_id = `TXN-${Date.now()}-${user_id}`;
            const paymentSql = `
                INSERT INTO payments (user_id, purchase_id, transaction_id, amount, payment_method, status) 
                VALUES ($1, $2, $3, $4, $5, 'pending')
            `;
            const paymentValues = [user_id, purchaseIds[0], transaction_id, totalAmount, payment_method || 'online'];
            await client.query(paymentSql, paymentValues);

            await client.query('COMMIT');
            return NextResponse.json({ success: true, message: "Order pending", transaction_id }, { status: 201 });

        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}