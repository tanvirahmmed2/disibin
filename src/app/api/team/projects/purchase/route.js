import { NextResponse } from "next/server";
import { isTeamLogin } from "@/lib/auth/team";
import { dbQuery } from "@/lib/database/pg";

// POST — Staff creates a manual purchase record for a project
export async function POST(req) {
    try {
        const auth = await isTeamLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const body = await req.json();
        const { project_id, product_id, price, discount } = body;

        if (!project_id || !price) {
            return NextResponse.json({ success: false, message: "Project ID and Price are required" }, { status: 400 });
        }

        const numericPrice = parseInt(price, 10);
        const numericDiscount = parseInt(discount || 0, 10);
        const finalPrice = Math.max(0, Math.round(numericPrice * (1 - numericDiscount / 100)));

        // Create purchase
        const purRes = await dbQuery(`
            INSERT INTO purchases (product_id, project_id, price, discount, status)
            VALUES ($1, $2, $3, $4, 'incomplete')
            RETURNING *
        `, [product_id || null, project_id, numericPrice, numericDiscount]);

        const purchase = purRes.rows[0];

        // Auto-create matching payment record
        const payRes = await dbQuery(`
            INSERT INTO payments (purchase_id, price, paid, due, status)
            VALUES ($1, $2, 0, $2, 'unpaid')
            RETURNING *
        `, [purchase.id, finalPrice]);

        // Record activity log
        await dbQuery(`
            INSERT INTO activity_logs (team_id, action, entity_type, entity_id, description)
            VALUES ($1, 'MANUAL_PURCHASE_CREATE', 'purchase', $2, $3)
        `, [auth.data.id, purchase.id, `Created manual purchase of $${finalPrice} for project #${project_id}`]).catch(() => {});

        return NextResponse.json({
            success: true,
            message: "Manual purchase and payment record created!",
            data: {
                purchase,
                payment: payRes.rows[0]
            }
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
