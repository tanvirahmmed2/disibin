import { NextResponse } from "next/server";
import { isUserLogin } from "@/lib/auth/user";
import { dbQuery } from "@/lib/database/pg";

// GET — List user's purchases & payments
export async function GET() {
    try {
        const auth = await isUserLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const userId = auth.data.id;

        const res = await dbQuery(`
            SELECT 
                pur.id as purchase_id, 
                pur.product_id, 
                pur.project_id, 
                pur.price, 
                pur.discount, 
                pur.status as purchase_status, 
                pur.created_at,
                prod.title as product_title, 
                prod.image as product_image, 
                prod.slug as product_slug,
                proj.title as project_title,
                pay.id as payment_id, 
                pay.price as payment_price, 
                pay.paid, 
                pay.due, 
                pay.status as payment_status
            FROM purchases pur
            LEFT JOIN products prod ON pur.product_id = prod.id
            LEFT JOIN projects proj ON pur.project_id = proj.id
            LEFT JOIN payments pay ON pur.id = pay.purchase_id
            WHERE proj.user_id = $1
            ORDER BY pur.created_at DESC
        `, [userId]).catch(() => ({ rows: [] }));

        return NextResponse.json({ success: true, data: res.rows });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
