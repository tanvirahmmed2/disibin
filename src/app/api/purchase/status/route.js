import { pool } from '@/lib/database/pg';
import { NextResponse } from 'next/server';

// Helper function to get purchases by status
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