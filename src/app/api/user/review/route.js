import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/database/pg';
import { isLogin } from '@/lib/middleware';

export async function GET() {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const res = await dbQuery("SELECT review_id, user_id, rating as rate, comment, is_approved, created_at FROM reviews WHERE user_id = $1 ORDER BY created_at DESC", [auth.data.id]);

        return NextResponse.json({ 
            success: true, 
            message: 'Reviews fetched', 
            data: res.rows 
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const { rating, comment } = await req.json();

        if (!rating || !comment) {
            return NextResponse.json({ success: false, message: 'Rating and comment are required' }, { status: 400 });
        }

        // Enforce one review per user
        const existing = await dbQuery("SELECT review_id FROM reviews WHERE user_id = $1", [auth.data.id]);
        if (existing.rows.length > 0) {
            return NextResponse.json({ success: false, message: 'You have already submitted a review. Delete it first to submit a new one.' }, { status: 409 });
        }

        const res = await dbQuery(
            "INSERT INTO reviews (user_id, rating, comment) VALUES ($1, $2, $3) RETURNING *",
            [auth.data.id, rating, comment]
        );

        return NextResponse.json({ 
            success: true, 
            message: 'Review submitted for approval', 
            data: res.rows[0] 
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ success: false, message: 'Review ID required' }, { status: 400 });

        await dbQuery("DELETE FROM reviews WHERE review_id = $1 AND user_id = $2", [id, auth.data.id]);

        return NextResponse.json({ success: true, message: 'Review deleted' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
