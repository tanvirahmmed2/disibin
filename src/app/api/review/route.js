import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/database/pg';
import { isLogin, isManager } from '@/lib/middleware';

export async function GET() {
    try {
        const auth = await isManager();
        
        let sql = `
            SELECT r.review_id, r.rating, r.comment, r.is_approved, r.created_at, u.name as user_name 
            FROM reviews r
            JOIN users u ON r.user_id = u.user_id
        `;
        
        if (auth.success) {
            // Manager gets all reviews
            sql += " ORDER BY r.created_at DESC";
            const res = await dbQuery(sql, []);
            return NextResponse.json({ success: true, message: 'All reviews fetched', data: res.rows });
        } else {
            // Public/User gets only approved reviews
            sql += " WHERE r.is_approved = true ORDER BY r.created_at DESC";
            const res = await dbQuery(sql, []);
            return NextResponse.json({ success: true, message: 'Approved reviews fetched', data: res.rows });
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const { rate, comment } = await req.json();
        if (!rate || !comment) return NextResponse.json({ success: false, message: 'Rate and comment are required' }, { status: 400 });

        const res = await dbQuery(`
            INSERT INTO reviews (user_id, rating, comment, is_approved)
            VALUES ($1, $2, $3, false)
            RETURNING *
        `, [auth.data.id, Number(rate), comment]);

        return NextResponse.json({
            success: true,
            message: 'Review submitted successfully! It will appear after approval.',
            data: res.rows[0]
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const { id, isApproved } = await req.json();
        const res = await dbQuery(`
            UPDATE reviews SET is_approved = $1, updated_at = NOW() WHERE review_id = $2 RETURNING *
        `, [isApproved, id]);

        if (res.rows.length === 0) return NextResponse.json({ success: false, message: 'Review not found' }, { status: 404 });

        return NextResponse.json({ success: true, message: 'Review status updated', data: res.rows[0] });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const { id } = await req.json();
        const res = await dbQuery("DELETE FROM reviews WHERE review_id = $1 RETURNING *", [id]);

        if (res.rows.length === 0) return NextResponse.json({ success: false, message: 'Review not found' }, { status: 404 });

        return NextResponse.json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
