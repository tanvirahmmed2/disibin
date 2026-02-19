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
                pp.amount_paid,
                pp.status AS subscription_status,
                pp.start_date,
                pp.expiry_date,
                pp.is_auto_renew,
                pp.created_at AS purchase_date,
                
                -- Deep data from the main Packages table
                json_build_object(
                    'id', p.package_id,
                    'slug', p.slug,
                    'image', p.image,
                    'category', p.category,
                    'features', p.features,
                    'description', p.description
                ) AS package_details,

                -- Deep data from the Payments table
                COALESCE(
                    (SELECT json_build_object(
                        'transaction_id', pay.transaction_id,
                        'method', pay.payment_method,
                        'gateway', pay.payment_gateway,
                        'status', pay.status,
                        'paid_at', pay.paid_at,
                        'currency', pay.currency
                    )
                    FROM public.payments pay 
                    WHERE pay.purchase_id = pp.purchase_id 
                    LIMIT 1), 
                    null
                ) AS payment_info

            FROM public.purchased_packages pp
            LEFT JOIN public.packages p ON pp.package_id = p.package_id
            WHERE pp.user_id = $1
            ORDER BY pp.created_at DESC
        `;

        const result = await pool.query(query, [auth.payload.user_id]);

        return NextResponse.json({
            success: true,
            message: 'Deep purchase history retrieved',
            payload: result.rows
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            message: 'Failed to fetch deep data', 
            error: error.message 
        }, { status: 500 });
    }
}