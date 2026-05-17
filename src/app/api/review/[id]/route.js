import { NextResponse } from "next/server";
import { isLogin, isManager } from "@/lib/middleware";
import { dbQuery } from "@/lib/database/pg";

// PATCH - Approve or reject a review (Manager only)
export async function PATCH(req, { params }) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { id } = await params;
        const { is_approved } = await req.json();

        if (is_approved === undefined) {
            return NextResponse.json({ success: false, message: "Approval status is required" }, { status: 400 });
        }

        const res = await dbQuery(`
            UPDATE reviews
            SET is_approved = $1
            WHERE review_id = $2
            RETURNING *
        `, [is_approved, id]);

        const review = res.rows[0];

        if (review && auth.data.id) {
            const logQuery = `
                INSERT INTO logs (user_id, action, entity_type, entity_id, description)
                VALUES ($1, $2, $3, $4, $5)
            `;
            await dbQuery(logQuery, [auth.data.id, is_approved ? 'APPROVE' : 'REJECT', 'review', id, JSON.stringify({ review_id: id })]);
        }
        
        if (!review) {
            return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: `Review ${is_approved ? 'approved' : 'rejected'} successfully`,
            data: review
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE - Remove a review (User deletes their own, Manager can delete any)
export async function DELETE(req, { params }) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const { id } = await params;
        
        // Check if user is manager
        const managerAuth = await isManager();
        const isUserManager = managerAuth.success;

        if (!isUserManager) {
            // If just a regular user, verify this is THEIR review
            const res = await dbQuery(`
                SELECT r.*
                FROM reviews r
                WHERE r.user_id = $1
            `, [auth.data.id]);
            
            const userReview = res.rows.length > 0 ? res.rows[0] : null;
            
            if (!userReview || userReview.review_id.toString() !== id) {
                return NextResponse.json({ success: false, message: "Unauthorized to delete this review" }, { status: 403 });
            }
        }

        const res = await dbQuery("DELETE FROM reviews WHERE review_id = $1 RETURNING *", [id]);
        const deletedReview = res.rows[0];

        if (deletedReview && auth.data.id) {
            const logQuery = `
                INSERT INTO logs (user_id, action, entity_type, entity_id, description)
                VALUES ($1, $2, $3, $4, $5)
            `;
            await dbQuery(logQuery, [auth.data.id, 'DELETE', 'review', id, JSON.stringify({ review_id: id })]);
        }

        if (!deletedReview) {
            return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Review deleted successfully"
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
