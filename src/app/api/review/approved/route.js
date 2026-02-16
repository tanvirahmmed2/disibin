import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const query = "SELECT * FROM public.reviews WHERE is_approved = true ORDER BY created_at DESC";
        const result = await pool.query(query);

        return NextResponse.json({
            success: true,
            message: 'Successfully fetched approved reviews',
            payload: result.rows || []
        }, { status: 200 });
        
    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            message: 'Failed to fetch reviews',
            error: error.message 
        }, { status: 500 });
    }
}