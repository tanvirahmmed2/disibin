import { pool } from '@/lib/database/pg';
import { isLogin } from '@/lib/middleware';
import { NextResponse } from 'next/server';

export async function POST(req) {
    const client = await pool.connect();
    try {
        const auth = await isLogin();
        if (!auth.success) {
            return NextResponse.json({ success: false, message: 'Please login' }, { status: 401 });
        }

        const user_id = auth.payload.user_id;
        const body = await req.json();
        const { items, payment_method } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ success: false, message: 'Wishlist is empty' }, { status: 400 });
        }

        let subTotal = 0;
        let totalDiscount = 0;

        items.forEach(item => {
            subTotal += Number(item.price) || 0;
            totalDiscount += Number(item.discount) || 0;
        });

        const payableAmount = subTotal - totalDiscount;

        await client.query('BEGIN');

        const purchaseQuery = `
            INSERT INTO public.purchases (user_id, total_amount, discount_amount, payable_amount, purchase_status)
            VALUES ($1, $2, $3, $4, 'pending')
            RETURNING purchase_id;
        `;
        const purchaseRes = await client.query(purchaseQuery, [user_id, subTotal, totalDiscount, payableAmount]);
        const purchaseId = purchaseRes.rows[0].purchase_id;

        for (const item of items) {
            const pkgQuery = `
                INSERT INTO public.purchased_packages (purchase_id, user_id, package_id, package_title, status)
                VALUES ($1, $2, $3, $4, 'pending');
            `;
            await client.query(pkgQuery, [purchaseId, user_id, item.package_id, item.title]);
        }

        // 3. Insert into payments table
        // Generating a unique transaction ID (You can replace this with gateway-specific IDs)
        const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const paymentQuery = `
    INSERT INTO public.payments (purchase_id, user_id, amount_paid, payment_method, status)
    VALUES ($1, $2, $3, $4, 'pending');
`;
        await client.query(paymentQuery, [purchaseId, user_id, payableAmount, payment_method]);
        // COMMIT TRANSACTION
        await client.query('COMMIT');

        return NextResponse.json({
            success: true,
            message: 'Order placed successfully! Our team will contact you soon.',
            purchase_id: purchaseId
        }, { status: 201 });

    } catch (error) {
        // ROLLBACK on error
        await client.query('ROLLBACK');
        console.error('Purchase Error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function PATCH(req) {
    const client = await pool.connect();
    try {
        const body = await req.json();
        const { purchase_id, transaction_id } = body;

        if (!purchase_id || !transaction_id) {
            return NextResponse.json({ message: 'Missing Purchase ID or Transaction ID' }, { status: 400 });
        }

        await client.query('BEGIN');

        const updatePayment = `
            UPDATE public.payments 
            SET transaction_id = $1, status = 'completed', paid_at = CURRENT_TIMESTAMP
            WHERE purchase_id = $2
            RETURNING payment_id;
        `;
        const payRes = await client.query(updatePayment, [transaction_id, purchase_id]);

        if (payRes.rowCount === 0) {
            throw new Error('Payment record not found');
        }

        const updatePurchase = `
            UPDATE public.purchases 
            SET purchase_status = 'active', updated_at = CURRENT_TIMESTAMP
            WHERE purchase_id = $1;
        `;
        await client.query(updatePurchase, [purchase_id]);

        const updatePackages = `
            UPDATE public.purchased_packages 
            SET status = 'active'
            WHERE purchase_id = $1;
        `;
        await client.query(updatePackages, [purchase_id]);

        await client.query('COMMIT');

        return NextResponse.json({ success: true, message: 'Payment verified and package activated!' });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Verification Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    } finally {
        client.release();
    }
}