import { pool } from '@/lib/database/pg';
import { isLogin, isManager } from '@/lib/middleware';
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
        const auth = await isManager();
        if (!auth.success) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const { purchase_id, payment_method, transaction_id } = await req.json();

        if (!purchase_id || !payment_method || !transaction_id) {
            return NextResponse.json({ success: false, message: 'Missing required details' }, { status: 400 });
        }

        await client.query('BEGIN');

        const payUpdate = await client.query(
            `UPDATE payments 
             SET transaction_id = $1, payment_method = $2, status = 'completed', paid_at = CURRENT_TIMESTAMP 
             WHERE purchase_id = $3 RETURNING *`,
            [transaction_id, payment_method, purchase_id]
        );

        if (payUpdate.rowCount === 0) {
            await client.query('ROLLBACK');
            return NextResponse.json({ success: false, message: 'Payment record not found' }, { status: 404 });
        }

        await client.query(
            `UPDATE purchases SET purchase_status = 'active', updated_at = CURRENT_TIMESTAMP WHERE purchase_id = $1`,
            [purchase_id]
        );

        await client.query(
            `UPDATE purchased_packages 
             SET status = 'active', start_date = CURRENT_TIMESTAMP, expiry_date = CURRENT_TIMESTAMP + INTERVAL '30 days' 
             WHERE purchase_id = $1`,
            [purchase_id]
        );

        await client.query('COMMIT');
        return NextResponse.json({ success: true, message: 'Payment verified and service activated' });

    } catch (error) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    } finally {
        client.release();
    }
}


export async function GET() {
    const client = await pool.connect();
    try {
        const auth = await isManager();
        if (!auth.success) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const query = `
            SELECT 
                p.purchase_id,
                p.total_amount,
                p.discount_amount,
                p.payable_amount,
                p.purchase_status,
                p.created_at AS order_date,
                u.name AS customer_name,
                u.email AS customer_email,
                pay.transaction_id,
                pay.payment_method,
                pay.status AS payment_status,
                pay.paid_at,
                (
                    SELECT json_agg(pkg)
                    FROM (
                        SELECT purchased_pkg_id, package_id, package_title, status, expiry_date
                        FROM public.purchased_packages
                        WHERE purchase_id = p.purchase_id
                    ) pkg
                ) AS items
            FROM public.purchases p
            INNER JOIN public.users u ON p.user_id = u.user_id
            LEFT JOIN public.payments pay ON p.purchase_id = pay.purchase_id
            ORDER BY p.created_at DESC;
        `;

        const result = await client.query(query);

        return NextResponse.json({ 
            success: true, 
            message: 'Sucessfully fetched data',
           payload: result.rows 
        });

    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            message: error.message 
        }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function DELETE(req) {
    const client = await pool.connect();
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        const { purchase_id } = await req.json();

        await client.query('BEGIN');
        // cascade deletes if foreign keys are set, otherwise delete manually:
        await client.query('DELETE FROM purchased_packages WHERE purchase_id = $1', [purchase_id]);
        await client.query('DELETE FROM payments WHERE purchase_id = $1', [purchase_id]);
        await client.query('DELETE FROM purchases WHERE purchase_id = $1', [purchase_id]);
        await client.query('COMMIT');

        return NextResponse.json({ success: true, message: 'Purchase record deleted' });
    } catch (error) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    } finally {
        client.release();
    }
}