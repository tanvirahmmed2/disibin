import { pool } from '@/lib/database/pg';
import { isLogin } from '@/lib/middleware';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const auth = await isLogin();
        
        if (!auth.success) {
            return NextResponse.json({
                success: false, 
                message: 'Unauthorized access'
            }, { status: 401 });
        }

        const query = `
            SELECT 
                pp.purchase_id,
                pp.package_title,
                pur.payable_amount AS total_price,
                pur.created_at AS order_date,
                pp.status AS access_status,
                pp.start_date,
                pp.expiry_date,
                pp.is_auto_renew,
                json_build_object(
                    'package_id', p.package_id,
                    'slug', p.slug,
                    'thumbnail', p.image,
                    'category', p.category,
                    'feature_list', p.features,
                    'brief', p.description
                ) AS package_info,
                CASE WHEN pay.payment_id IS NOT NULL THEN
                    json_build_object(
                        'txn_id', pay.transaction_id,
                        'method', pay.payment_method,
                        'gateway', pay.payment_gateway,
                        'payment_status', pay.status,
                        'paid_at', pay.paid_at,
                        'currency', pay.currency
                    )
                ELSE null END AS billing_info
            FROM public.purchased_packages pp
            LEFT JOIN public.packages p ON pp.package_id = p.package_id
            LEFT JOIN public.purchases pur ON pp.purchase_id = pur.purchase_id
            LEFT JOIN public.payments pay ON pp.purchase_id = pay.purchase_id
            WHERE pp.user_id = $1
            ORDER BY pur.created_at DESC
        `;

        const result = await pool.query(query, [auth.payload.user_id]);

        return NextResponse.json({
            success: true,
            message: 'Subscription and purchase history retrieved',
            payload: result.rows
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            message: 'Internal server error', 
            error: error.message 
        }, { status: 500 });
    }
}