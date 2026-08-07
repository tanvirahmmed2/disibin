import { NextResponse } from "next/server";
import { isTeamLogin } from "@/lib/auth/team";
import { dbQuery } from "@/lib/database/pg";

// PATCH — Staff updates payment status and amount paid/due, completing purchase when paid
export async function PATCH(req) {
    try {
        const auth = await isTeamLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const body = await req.json();
        const { payment_id, paid, status } = body;

        if (!payment_id) {
            return NextResponse.json({ success: false, message: "Payment ID is required" }, { status: 400 });
        }

        // Get current payment record
        const currentRes = await dbQuery("SELECT * FROM payments WHERE id = $1", [payment_id]);
        if (currentRes.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Payment record not found" }, { status: 404 });
        }

        const payment = currentRes.rows[0];
        const totalPrice = Number(payment.price);
        const newPaid = paid !== undefined ? Math.min(totalPrice, Math.max(0, Number(paid))) : Number(payment.paid);
        const newDue = Math.max(0, totalPrice - newPaid);

        let newStatus = status;
        if (!newStatus) {
            if (newDue <= 0) newStatus = 'paid';
            else if (newPaid > 0) newStatus = 'due';
            else newStatus = 'unpaid';
        }

        // Send notification to customer user if user_id exists
        const purUserRes = await dbQuery("SELECT user_id, project_id FROM purchases WHERE id = $1", [payment.purchase_id]).catch(() => ({ rows: [] }));
        if (purUserRes.rows.length > 0 && purUserRes.rows[0].user_id) {
            const userId = purUserRes.rows[0].user_id;
            await dbQuery(`
                INSERT INTO notifications (user_id, title, message, type, link)
                VALUES ($1, $2, $3, $4, $5)
            `, [
                userId,
                "Payment Recorded 💳",
                `Payment of $${newPaid} recorded (Status: ${newStatus.toUpperCase()}). Thank you!`,
                "system",
                "/user/purchases"
            ]).catch((err) => console.error("Payment notification failed:", err));
        }

        if (newStatus === 'paid') {
            const payUpdateRes = await dbQuery(`
                UPDATE payments
                SET paid = $1, due = 0, status = 'paid', updated_at = now()
                WHERE id = $2
                RETURNING *
            `, [totalPrice, payment_id]);

            // Automatically complete purchase
            await dbQuery(`
                UPDATE purchases
                SET status = 'complete', updated_at = now()
                WHERE id = $1
            `, [payment.purchase_id]);

            return NextResponse.json({
                success: true,
                message: "Payment completed and purchase status marked as Complete!",
                data: payUpdateRes.rows[0]
            });
        } else {
            const payUpdateRes = await dbQuery(`
                UPDATE payments
                SET paid = $1, due = $2, status = $3, updated_at = now()
                WHERE id = $4
                RETURNING *
            `, [newPaid, newDue, newStatus, payment_id]);

            if (newStatus === 'unpaid') {
                await dbQuery(`
                    UPDATE purchases
                    SET status = 'incomplete', updated_at = now()
                    WHERE id = $1
                `, [payment.purchase_id]);
            }

            return NextResponse.json({
                success: true,
                message: "Payment record updated successfully",
                data: payUpdateRes.rows[0]
            });
        }

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
