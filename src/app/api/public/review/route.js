import { NextResponse } from "next/server";
import { isManager } from "@/lib/auth/team";
import { isUserLogin as isLogin } from "@/lib/auth/user";
import { dbQuery } from "@/lib/database/pg";

// POST - Create a review (User only)
export async function POST(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const body = await req.json();
        const { rating, comment } = body;

        const numericRating = parseInt(rating);
        if (!numericRating || numericRating < 1 || numericRating > 5) {
            return NextResponse.json({ success: false, message: "Rating must be between 1 and 5 stars" }, { status: 400 });
        }

        // Check if user already submitted a review
        const checkRes = await dbQuery("SELECT id FROM reviews WHERE user_id = $1", [auth.data.id]);
        if (checkRes.rows.length > 0) {
            return NextResponse.json({ success: false, message: "You have already submitted a review." }, { status: 400 });
        }

        const res = await dbQuery(`
            INSERT INTO reviews (user_id, rating, comment)
            VALUES ($1, $2, $3)
            RETURNING id, user_id, rating, comment, reply, is_approved, created_at
        `, [auth.data.id, numericRating, (comment || "").trim()]);

        const review = res.rows[0];

        // Record activity log
        await dbQuery(`
            INSERT INTO activity_logs (team_id, action, entity_type, entity_id, description)
            VALUES (NULL, $1, $2, $3, $4)
        `, ['REVIEW_CREATE', 'review', review.id, `User ${auth.data.name || auth.data.email} submitted a ${rating}-star review`]).catch(() => {});

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
        const limitParam = searchParams.get('limit');
        const limit = limitParam ? parseInt(limitParam) : null;

        // Public showcase — approved reviews with user name
        if (type === 'public') {
            let sql = `
                SELECT r.id, r.user_id, r.rating, r.comment, r.reply, r.is_approved, r.created_at, u.name as user_name
                FROM reviews r
                JOIN users u ON r.user_id = u.id
                WHERE r.is_approved = true
                ORDER BY r.created_at DESC
            `;
            let params = [];
            if (limit && limit > 0) {
                sql += ` LIMIT $1`;
                params.push(limit);
            }
            const res = await dbQuery(sql, params);
            return NextResponse.json({ success: true, data: res.rows });
        }

        // Manager access — all reviews
        if (type === 'all') {
            const managerAuth = await isManager();
            if (!managerAuth.success) return NextResponse.json(managerAuth, { status: 403 });

            const res = await dbQuery(`
                SELECT r.id, r.user_id, r.rating, r.comment, r.reply, r.is_approved, r.created_at,
                       u.name as user_name, u.email as user_email
                FROM reviews r
                JOIN users u ON r.user_id = u.id
                ORDER BY r.created_at DESC
            `);

            return NextResponse.json({ success: true, data: res.rows });
        }

        // Current User review (or fallback to public if not logged in)
        const auth = await isLogin();
        if (auth.success) {
            const res = await dbQuery(`
                SELECT r.id, r.user_id, r.rating, r.comment, r.reply, r.is_approved, r.created_at
                FROM reviews r
                WHERE r.user_id = $1
            `, [auth.data.id]);

            const userReview = res.rows.length > 0 ? res.rows[0] : null;
            return NextResponse.json({ success: true, data: userReview });
        }

        // Fallback for non-logged in GET requests without type
        let sql = `
            SELECT r.id, r.user_id, r.rating, r.comment, r.reply, r.is_approved, r.created_at, u.name as user_name
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.is_approved = true
            ORDER BY r.created_at DESC
        `;
        let params = [];
        if (limit && limit > 0) {
            sql += ` LIMIT $1`;
            params.push(limit);
        }
        const res = await dbQuery(sql, params);
        return NextResponse.json({ success: true, data: res.rows });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
