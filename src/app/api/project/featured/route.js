import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const query = "SELECT * FROM public.projects WHERE is_featured = true ORDER BY created_at DESC";
        const result = await pool.query(query);

        if (result.rowCount === 0) {
            return NextResponse.json({ 
                success: true, 
                message: 'No featured projects found', 
                payload: [] 
            }, { status: 200 });
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Successfully fetched data', 
            payload: result.rows 
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            message: 'Failed to fetch data', 
            error: error.message 
        }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ success: false, message: 'Id is required' }, { status: 400 });
        }

        const query = `
            UPDATE public.projects 
            SET is_featured = NOT is_featured, updated_at = CURRENT_TIMESTAMP 
            WHERE project_id = $1 
            RETURNING is_featured;
        `;
        
        const result = await pool.query(query, [id]);

        if (result.rowCount === 0) {
            return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 });
        }

        const isFeatured = result.rows[0].is_featured;

        return NextResponse.json({
            success: true,
            message: isFeatured ? 'Added to featured' : 'Removed from featured',
            payload: isFeatured
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            message: 'Failed to update featured status', 
            error: error.message 
        }, { status: 500 });
    }
}