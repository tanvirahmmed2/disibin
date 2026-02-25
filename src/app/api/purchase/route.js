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


export async function GET() {
    const client = await pool.connect();
    try {
        const query = `
            SELECT 
                p.purchase_id,
                p.total_amount,
                p.discount_amount,
                p.payable_amount,
                p.purchase_status,
                p.purchase_date,
                p.created_at as purchase_created_at,
                -- User Details
                u.name as user_name,
                u.email as user_email,
                -- Payment Details
                pay.payment_id,
                pay.transaction_id,
                pay.amount_paid,
                pay.payment_method,
                pay.status as payment_status,
                pay.paid_at,
                -- Nested JSON array of all packages in this purchase
                (
                    SELECT json_agg(pkg)
                    FROM (
                        SELECT purchased_pkg_id, package_id, package_title, status, expiry_date
                        FROM public.purchased_packages
                        WHERE purchase_id = p.purchase_id
                    ) pkg
                ) as items
            FROM public.purchases p
            INNER JOIN public.users u ON p.user_id = u.user_id
            LEFT JOIN public.payments pay ON p.purchase_id = pay.purchase_id
            ORDER BY p.created_at DESC;
        `;

        const result = await client.query(query);

        return NextResponse.json({ 
            success: true, 
            count: result.rowCount,
            data: result.rows 
        });

    } catch (error) {
        console.error('Fetch All Purchases Error:', error);
        return NextResponse.json({ 
            success: false, 
            message: 'Failed to fetch purchase history' 
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