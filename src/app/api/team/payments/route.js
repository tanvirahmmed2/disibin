import { NextResponse } from "next/server";
import { isTeamLogin } from "@/lib/auth/team";
import { dbQuery } from "@/lib/database/pg";

// GET — List all payments & invoices across customer projects
export async function GET() {
    try {
        const auth = await isTeamLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const res = await dbQuery(`
            SELECT 
                pay.id as payment_id,
                pay.purchase_id,
                pay.price as total_price,
                pay.paid as paid_amount,
                pay.due as due_amount,
                pay.status as payment_status,
                pay.created_at,
                pay.updated_at,
                pur.product_id,
                pur.project_id,
                pur.status as purchase_status,
                prod.title as product_title,
                proj.title as project_title,
                u.id as user_id,
                u.name as user_name,
                u.email as user_email
            FROM payments pay
            JOIN purchases pur ON pay.purchase_id = pur.id
            LEFT JOIN products prod ON pur.product_id = prod.id
            LEFT JOIN projects proj ON pur.project_id = proj.id
            LEFT JOIN users u ON proj.user_id = u.id
            ORDER BY pay.created_at DESC
        `).catch(() => ({ rows: [] }));

        return NextResponse.json({ success: true, data: res.rows });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
