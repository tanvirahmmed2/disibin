import { pool } from '@/lib/database/pg';
import { NextResponse } from 'next/server';

async function getPurchasesByStatus(status) {
    const client = await pool.connect();
    try {
        const query = `
            SELECT 
                p.purchase_id,
                p.total_amount,
                p.payable_amount,
                p.purchase_status,
                p.created_at,
                u.user_id,
                u.name as user_name,
                u.email as user_email,
                pay.payment_method,
                pay.transaction_id,
                pay.status as payment_status,
                -- Aggregate package titles into an array for easy display
                array_agg(pp.package_title) as package_titles
            FROM public.purchases p
            JOIN public.users u ON p.user_id = u.user_id
            JOIN public.payments pay ON p.purchase_id = pay.purchase_id
            LEFT JOIN public.purchased_packages pp ON p.purchase_id = pp.purchase_id
            WHERE p.purchase_status = $1
            GROUP BY p.purchase_id, u.user_id, pay.payment_id
            ORDER BY p.created_at DESC;
        `;
        const result = await client.query(query, [status]);
        return result.rows;
    } finally {
        client.release();
    }
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');

        if (!['pending', 'active', 'completed'].includes(status)) {
            return NextResponse.json({ message: 'Invalid status parameter' }, { status: 400 });
        }

        const data = await getPurchasesByStatus(status);
        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Fetch Error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req) {
    const client = await pool.connect();
    try {
        const { purchase_id, status } = await req.json();

        if (!purchase_id || !status) {
            return NextResponse.json({
                success: false, 
                message: 'Purchase ID or status not received',
            }, { status: 400 });
        }

        const purchaseCheck = await client.query(`SELECT purchase_status FROM purchases WHERE purchase_id=$1`, [purchase_id]);
        if (purchaseCheck.rowCount === 0) {
            return NextResponse.json({ success: false, message: 'Purchase not found' }, { status: 404 });
        }
        
        const currentPurchaseStatus = purchaseCheck.rows[0].purchase_status;

        if (['completed', 'expired', 'cancelled'].includes(currentPurchaseStatus)) {
            return NextResponse.json({
                success: false,
                message: `Cannot update a purchase that is already ${currentPurchaseStatus}`
            }, { status: 400 });
        }

        const paymentCheck = await client.query(`SELECT status FROM payments WHERE purchase_id=$1`, [purchase_id]);
        if (paymentCheck.rowCount === 0) {
            return NextResponse.json({ success: false, message: 'Payment data not found' }, { status: 400 });
        }

        const paymentStatus = paymentCheck.rows[0].status;

        if ((status === 'completed' || status === 'active') && paymentStatus !== 'completed') {
            return NextResponse.json({
                success: false, 
                message: `Please verify payment before setting status to ${status}`
            }, { status: 400 });
        }

        await client.query('BEGIN');

        await client.query(
            `UPDATE purchases SET purchase_status=$1, updated_at = CURRENT_TIMESTAMP WHERE purchase_id=$2`,
            [status, purchase_id]
        );

        await client.query(
            `UPDATE purchased_packages SET status=$1 WHERE purchase_id=$2`,
            [status, purchase_id]
        );

        await client.query('COMMIT');

        return NextResponse.json({
            success: true, 
            message: `Purchase status updated to ${status}`
        }, { status: 200 });

    } catch (error) {
        await client.query('ROLLBACK');
        return NextResponse.json({
            success: false, message: error.message
        }, { status: 500 });
    } finally {
        client.release();
    }
}