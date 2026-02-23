import { pool } from '@/lib/database/pg';
import { isLogin } from '@/lib/middleware';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const auth= await isLogin()
        if(!auth.success){
            return NextResponse.json({
                success:false, message:'Please login before placing order'
            },{status:400})
        }

        const user_id= auth.payload.user_id

        const body = await req.json();
        const { items, totalAmount, payment_method } = body;

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const purchaseResults = [];

            for (const item of items) {
                const packageSql = `
                    INSERT INTO purchased_packages (
                        user_id, package_id, package_title, amount_paid, status
                    ) VALUES ($1, $2, $3, $4, 'pending')
                    RETURNING purchase_id;
                `;
                const packageValues = [user_id, item.package_id, item.title, item.price];
                const res = await client.query(packageSql, packageValues);
                purchaseResults.push(res.rows[0].purchase_id);
            }

            const transaction_id = `TXN-${Date.now()}-${user_id}`;
            const paymentSql = `
                INSERT INTO payments (
                    user_id, purchase_id, transaction_id, amount, payment_method, status
                ) VALUES ($1, $2, $3, $4, $5, 'pending')
                RETURNING payment_id;
            `;
            const paymentValues = [
                user_id, 
                purchaseResults[0], 
                transaction_id, 
                totalAmount, 
                payment_method || 'online'
            ];
            await client.query(paymentSql, paymentValues);

            await client.query('COMMIT');

            return NextResponse.json({ 
                success: true, 
                message: "Order initiated", 
                transaction_id 
            }, { status: 201 });

        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }

    } catch (error) {
        console.error('Purchase Error:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}