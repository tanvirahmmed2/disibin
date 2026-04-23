import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/database/pg';



export async function GET() {
    try {
        const res = await dbQuery(`
            SELECT r.*, u.name as user_name, u.email as user_email 
            FROM reviews r
            JOIN users u ON r.user_id = u.user_id
            WHERE r.is_approved = true
            ORDER BY r.created_at DESC
        `, []);

        return NextResponse.json({ success: true, message: 'Approved reviews fetched', data: res.rows });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
