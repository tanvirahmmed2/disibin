import { NextResponse } from "next/server";
import { isManager } from "@/lib/auth/team";
import { isUserLogin as isLogin } from "@/lib/auth/user";
import { dbQuery } from "@/lib/database/pg";

// PATCH - Approve/reject review and update staff reply (Manager only)
export async function PATCH(req, { params }) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const resolvedParams = await params;
        const reviewId = resolvedParams.id;
        const body = await req.json();
        const { is_approved, reply } = body;

        let query = "UPDATE reviews SET ";
        const queryParams = [];
        const updates = [];

        if (is_approved !== undefined) {
            queryParams.push(Boolean(is_approved));
            updates.push(`is_approved = $${queryParams.length}`);
        }

        if (reply !== undefined) {
            queryParams.push(reply ? reply.trim() : null);
            updates.push(`reply = $${queryParams.length}`);
        }

        if (updates.length === 0) {
            return NextResponse.json({ success: false, message: "Nothing to update" }, { status: 400 });
        }

        queryParams.push(reviewId);
        query += updates.join(", ") + ` WHERE id = $${queryParams.length} RETURNING id, user_id, rating, comment, reply, is_approved, created_at`;

        const res = await dbQuery(query, queryParams);
        const review = res.rows[0];

        if (!review) {
            return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 });
        }

        // Record activity log
        await dbQuery(`
            INSERT INTO activity_logs (team_id, action, entity_type, entity_id, description)
            VALUES ($1, $2, $3, $4, $5)
        `, [auth.data.id, 'REVIEW_UPDATE', 'review', reviewId, `Updated review #${reviewId} (approved: ${review.is_approved})`]).catch(() => {});

        // Send notification to user if review was approved
        if (Boolean(is_approved) && review.user_id) {
            await dbQuery(`
                INSERT INTO notifications (user_id, title, message, type, link)
                VALUES ($1, $2, $3, $4, $5)
            `, [
                review.user_id,
                "Review Approved! ⭐",
                `Your ${review.rating}-star review has been approved and published on our platform. Thank you for your valuable feedback!`,
                "review",
                "/user/reviews"
            ]).catch((err) => console.error("Notification insertion error:", err));
        } else if (reply && review.user_id) {
            await dbQuery(`
                INSERT INTO notifications (user_id, title, message, type, link)
                VALUES ($1, $2, $3, $4, $5)
            `, [
                review.user_id,
                "Staff Replied to Your Review",
                `Our team posted an official reply to your review: "${reply.substring(0, 80)}${reply.length > 80 ? '...' : ''}"`,
                "review",
                "/user/reviews"
            ]).catch((err) => console.error("Notification insertion error:", err));
        }

        return NextResponse.json({
            success: true,
            message: "Review updated successfully",
            data: review
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE - Remove a review (User deletes their own, Manager can delete any)
export async function DELETE(req, { params }) {
    try {
        const resolvedParams = await params;
        const reviewId = resolvedParams.id;

        const userAuth = await isLogin();
        const managerAuth = await isManager();

        if (!userAuth.success && !managerAuth.success) {
            return NextResponse.json({ success: false, message: "Please login" }, { status: 401 });
        }

        const isUserManager = managerAuth.success;

        if (!isUserManager) {
            // Check if this is the user's review
            const userReviewRes = await dbQuery("SELECT id FROM reviews WHERE id = $1 AND user_id = $2", [reviewId, userAuth.data.id]);
            if (userReviewRes.rows.length === 0) {
                return NextResponse.json({ success: false, message: "Unauthorized to delete this review" }, { status: 403 });
            }
        }

        const res = await dbQuery("DELETE FROM reviews WHERE id = $1 RETURNING id", [reviewId]);
        if (res.rows.length === 0) {
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
