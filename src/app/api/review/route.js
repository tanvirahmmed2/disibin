import { NextResponse } from "next/server";
import { isLogin, isManager } from "@/lib/middleware";
import { dbQuery } from "@/lib/database/pg";

// POST - Create a review (User only)
export async function POST(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const body = await req.json();
        const { rating, comment } = body;

        if (!rating) {
            return NextResponse.json({ success: false, message: "Rating is required" }, { status: 400 });
        }

        // Check if they already have a review
        const checkRes = await dbQuery("SELECT review_id FROM reviews WHERE user_id = $1", [auth.data.id]);
        if (checkRes.rows.length > 0) {
            return NextResponse.json({ success: false, message: "You have already submitted a review." }, { status: 400 });
        }

        const res = await dbQuery(`
            INSERT INTO reviews (user_id, rating, comment)
            VALUES ($1, $2, $3)
            RETURNING *
        `, [auth.data.id, rating, comment]);

        const review = res.rows[0];

        // Log the action
        const logQuery = `
            INSERT INTO logs (user_id, action, entity_type, entity_id, description)
            VALUES ($1, $2, $3, $4, $5)
        `;
        await dbQuery(logQuery, [auth.data.id, 'CREATE', 'review', review.review_id, JSON.stringify({ rating, comment })]);

        return NextResponse.json({
            success: true,
            message: "Review submitted successfully and is pending approval.",
            data: review
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// GET - Fetch reviews
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');

        // Public access (or fallback for non-logged in users)
        if (type === 'public' || !type) {
            const res = await dbQuery(`
                SELECT r.*, u.name as user_name
                FROM reviews r
                JOIN users u ON r.user_id = u.user_id
                WHERE r.is_approved = true
                ORDER BY r.created_at DESC
            `, []);
            return NextResponse.json({ success: true, data: res.rows });
        }

        const auth = await isLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        // Managers requesting all reviews
        if (type === 'all') {
            const managerAuth = await isManager();
            if (!managerAuth.success) return NextResponse.json(managerAuth, { status: 403 });
            
            const res = await dbQuery(`
                SELECT r.*, 
                       u.name as user_name, u.email as user_email
                FROM reviews r
                JOIN users u ON r.user_id = u.user_id
                ORDER BY r.created_at DESC
            `, []);
            
            return NextResponse.json({ success: true, data: res.rows });
        }

        // Users requesting their own review
        const res = await dbQuery(`
            SELECT r.*
            FROM reviews r
            WHERE r.user_id = $1
        `, [auth.data.id]);
        
        const userReview = res.rows.length > 0 ? res.rows[0] : null;

        return NextResponse.json({ success: true, data: userReview });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
