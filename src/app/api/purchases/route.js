import { NextResponse } from "next/server";
import { isManager, isLogin } from "@/lib/middleware";
import { dbQuery, transaction } from "@/lib/database/pg";

export async function GET(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        let query = `
            SELECT p.*, u.name as user_name, u.email as user_email,
                   a.name as approved_by_name,
                   pay.method as payment_method, pay.provider as payment_provider, pay.transaction_id
            FROM purchases p
            LEFT JOIN users u ON p.user_id = u.user_id
            LEFT JOIN users a ON p.approved_by = a.user_id
            LEFT JOIN payments pay ON p.purchase_id = pay.purchase_id
        `;

        let params = [];
        if (auth.data.role !== 'manager' && auth.data.role !== 'admin') {
            query += ` WHERE p.user_id = $1`;
            params.push(auth.data.id);
        }

        query += ` ORDER BY p.created_at DESC`;
        
        const res = await dbQuery(query, params);
        
        return NextResponse.json({ success: true, data: res.rows });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { purchaseId, status, reason } = await req.json();

        if (!purchaseId || !status) {
            return NextResponse.json({ success: false, message: "Purchase ID and status are required" }, { status: 400 });
        }

        const result = await transaction(async (client) => {
            // Update purchase status
            const query = `
                UPDATE purchases 
                SET status = $1, 
                    approved_by = $2, 
                    approved_at = CASE WHEN $1 = 'approved' THEN now() ELSE approved_at END,
                    rejected_reason = $3,
                    updated_at = now() 
                WHERE purchase_id = $4 
                RETURNING *
            `;
            const res = await client.query(query, [status, auth.data.id, reason, purchaseId]);
            const purchase = res.rows[0];

            if (!purchase) {
                throw new Error("Purchase not found");
            }

            // Update payment status if approved
            if (status === 'approved') {
                await client.query(`
                    UPDATE payments 
                    SET status = 'success', paid_at = now()
                    WHERE purchase_id = $1
                `, [purchaseId]);

                // Fetch product for duration
                const prodRes = await client.query("SELECT duration_days, is_lifetime FROM products WHERE product_id = $1", [purchase.product_id]);
                const product = prodRes.rows[0];

                if (product) {
                    // Check existing subscription
                    const subRes = await client.query(`
                        SELECT * FROM subscriptions 
                        WHERE user_id = $1 AND product_id = $2 AND status = 'active'
                        FOR UPDATE
                    `, [purchase.user_id, purchase.product_id]);
                    
                    const existingSub = subRes.rows[0];
                    const now = new Date();
                    
                    let startDate = now;
                    let endDate = now;

                    if (product.is_lifetime) {
                        endDate = new Date(now.getFullYear() + 100, now.getMonth(), now.getDate()); // 100 years
                    } else {
                        const daysToAdd = product.duration_days || 0;
                        
                        if (existingSub && new Date(existingSub.end_date) > now) {
                            // Extend existing active subscription
                            startDate = new Date(existingSub.start_date);
                            endDate = new Date(existingSub.end_date);
                            endDate.setDate(endDate.getDate() + daysToAdd);
                        } else {
                            // New subscription or expired one
                            endDate.setDate(endDate.getDate() + daysToAdd);
                        }
                    }

                    if (existingSub) {
                        await client.query(`
                            UPDATE subscriptions 
                            SET end_date = $1, updated_at = now()
                            WHERE subscription_id = $2
                        `, [endDate, existingSub.subscription_id]);
                    } else {
                        await client.query(`
                            INSERT INTO subscriptions (user_id, product_id, start_date, end_date, status)
                            VALUES ($1, $2, $3, $4, 'active')
                        `, [purchase.user_id, purchase.product_id, startDate, endDate]);
                    }

                    // Create automatic ticket
                    const ticketSubject = `Purchase Approved: ${purchase.product_name}`;
                    const ticketMessage = `Hello, your purchase of "${purchase.product_name}" has been approved! I will assist you with the setup shortly.`;
                    
                    await client.query(`
                        INSERT INTO tickets (user_id, subject, message, priority, assigned_to)
                        VALUES ($1, $2, $3, $4, $5)
                    `, [purchase.user_id, ticketSubject, ticketMessage, 'high', auth.data.id]);
                }
            } else if (status === 'rejected') {
                await client.query(`
                    UPDATE payments 
                    SET status = 'failed'
                    WHERE purchase_id = $1
                `, [purchaseId]);
            }

            return purchase;
        });
        
        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { searchParams } = new URL(req.url);
        const purchaseId = searchParams.get('id');

        if (!purchaseId) {
            return NextResponse.json({ success: false, message: "Purchase ID is required" }, { status: 400 });
        }

        const res = await dbQuery("DELETE FROM purchases WHERE purchase_id = $1 RETURNING *", [purchaseId]);
        const purchase = res.rows[0];

        if (!purchase) {
            return NextResponse.json({ success: false, message: "Purchase not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Purchase deleted successfully", data: purchase });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
