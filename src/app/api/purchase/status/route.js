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
        const auth = await isManager();
        if (!auth.success) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const { purchase_id, status } = await req.json();

        await client.query('BEGIN');

        // Get current payment status
        const payRes = await client.query('SELECT status FROM payments WHERE purchase_id = $1', [purchase_id]);
        if (payRes.rowCount === 0) {
            await client.query('ROLLBACK');
            return NextResponse.json({ success: false, message: 'Payment record not found' }, { status: 404 });
        }
        const currentPaymentStatus = payRes.rows[0].status;

        if (status === 'completed') {
            // Logic: Only work when payment status is completed
            if (currentPaymentStatus !== 'completed') {
                await client.query('ROLLBACK');
                return NextResponse.json({ 
                    success: false, 
                    message: 'Cannot set to completed. Payment must be verified first.' 
                }, { status: 400 });
            }

            await client.query(`UPDATE purchases SET purchase_status = 'completed' WHERE purchase_id = $1`, [purchase_id]);
            await client.query(`UPDATE purchased_packages SET status = 'completed' WHERE purchase_id = $1`, [purchase_id]);
        } 
        
        else if (status === 'expired') {
            // Logic: Purchase status becomes expired, payment status becomes refunded
            await client.query(`UPDATE purchases SET purchase_status = 'expired' WHERE purchase_id = $1`, [purchase_id]);
            await client.query(`UPDATE purchased_packages SET status = 'expired' WHERE purchase_id = $1`, [purchase_id]);
            await client.query(`UPDATE payments SET status = 'refunded' WHERE purchase_id = $1`, [purchase_id]);
        }

        else if (status === 'cancelled') {
            await client.query(`UPDATE purchases SET purchase_status = 'cancelled' WHERE purchase_id = $1`, [purchase_id]);
            await client.query(`UPDATE purchased_packages SET status = 'cancelled' WHERE purchase_id = $1`, [purchase_id]);
            await client.query(`UPDATE payments SET status = 'failed' WHERE purchase_id = $1`, [purchase_id]);
        }

        await client.query('COMMIT');
        return NextResponse.json({ success: true, message: `Status successfully changed to ${status}` });

    } catch (error) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    } finally {
        client.release();
    }
}