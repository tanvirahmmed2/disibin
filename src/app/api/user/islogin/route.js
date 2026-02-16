import { pool } from "@/lib/database/pg";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "@/lib/database/secret";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const token = (await cookies()).get('user_token')?.value;

        if (!token) {
            return NextResponse.json({ success: false, message: 'Please login' }, { status: 400 });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        
        if (!decoded || !decoded.id) {
            return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 401 });
        }

        const query = `
            SELECT 
                user_id, name, email, phone, role, 
                address_line1, address_line2, city, state, 
                postal_code, country, is_active, 
                email_verified, created_at 
            FROM public.users 
            WHERE user_id = $1 LIMIT 1
        `;
        
        const result = await pool.query(query, [decoded.id]);

        if (result.rowCount === 0) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        const user = result.rows[0];

        if (!user.is_active) {
            return NextResponse.json({ success: false, message: 'Account is deactivated' }, { status: 403 });
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Successfully verified user', 
            payload: user 
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            message: 'Failed to authenticate user', 
            error: error.message 
        }, { status: 500 });
    }
}