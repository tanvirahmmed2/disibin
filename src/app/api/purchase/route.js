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
            return NextResponse.json({ 
                success: false, 
                message: 'Missing required payment details' 
            }, { status: 400 });
        }

        await client.query('BEGIN');

        // 1. Check if payment record exists and is not already completed
        const paymentCheck = await client.query(
            `SELECT status FROM payments WHERE purchase_id = $1`,
            [purchase_id]
        );

        if (paymentCheck.rowCount === 0) {
            await client.query('ROLLBACK');
            return NextResponse.json({ success: false, message: 'Payment record not found' }, { status: 404 });
        }

        if (paymentCheck.rows[0].status === 'completed') {
            await client.query('ROLLBACK');
            return NextResponse.json({ success: false, message: 'Payment already verified' }, { status: 400 });
        }

        // 2. Update the payment record
        const updatePaymentQuery = `
            UPDATE payments 
            SET 
                transaction_id = $1, 
                payment_method = $2, 
                status = 'completed', 
                paid_at = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
            WHERE purchase_id = $3
            RETURNING *;
        `;
        
        await client.query(updatePaymentQuery, [transaction_id, payment_method, purchase_id]);

        // 3. Optional: Update the purchase status to 'completed' (waiting for final activation)
        await client.query(
            `UPDATE purchases SET purchase_status = 'completed', updated_at = CURRENT_TIMESTAMP WHERE purchase_id = $1`,
            [purchase_id]
        );

        await client.query('COMMIT');

        return NextResponse.json({ 
            success: true, 
            message: 'Payment successfully recorded and verified' 
        }, { status: 200 });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Payment Update Error:', error);
        return NextResponse.json({ 
            success: false, 
            message: error.message 
        }, { status: 500 });
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
    const { id } =await req.json()
    const client = await pool.connect();

    try {
        if (!id) {
            return NextResponse.json({ message: 'Purchase ID is required' }, { status: 400 });
        }

        await client.query('BEGIN');

        const checkQuery = `SELECT purchase_id FROM public.purchases WHERE purchase_id = $1`;
        const checkRes = await client.query(checkQuery, [id]);

        if (checkRes.rowCount === 0) {
            return NextResponse.json({ success: false, message: 'Purchase not found' }, { status: 404 });
        }

        // Delete the purchase. 
        // Note: Because of ON DELETE CASCADE in your schema, 
        // related rows in payments and purchased_packages will be deleted automatically.
        const deleteQuery = `DELETE FROM public.purchases WHERE purchase_id = $1`;
        await client.query(deleteQuery, [id]);

        await client.query('COMMIT');

        return NextResponse.json({ 
            success: true, 
            message: `Purchase #${id} and all related records deleted successfully.` 
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Delete Error:', error);
        return NextResponse.json({ 
            success: false, 
            message: 'Internal Server Error' 
        }, { status: 500 });
    } finally {
        client.release();
    }
}