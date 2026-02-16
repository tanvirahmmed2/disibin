import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function POST(req) {
    try {
        const { id, title, description, category, preview, tags, skills, price, isFeatured } = await req.json();

        if (!id || !title || !description) {
            return NextResponse.json({
                success: false,
                message: 'ID, title, and description are required'
            }, { status: 400 });
        }

        const newSlug = slugify(title, { strict: true, lower: true });

        const tagsArr = typeof tags === 'string' 
            ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) 
            : Array.isArray(tags) ? tags : [];
            
        const skillsArr = typeof skills === 'string' 
            ? skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0) 
            : Array.isArray(skills) ? skills : [];

        const query = `
            UPDATE public.projects 
            SET 
                title = $1, 
                description = $2, 
                slug = $3, 
                category = $4, 
                preview = $5, 
                tags = $6, 
                skills = $7, 
                price = $8, 
                is_featured = $9,
                updated_at = CURRENT_TIMESTAMP
            WHERE project_id = $10
            RETURNING *;
        `;

        const values = [
            title, 
            description, 
            newSlug, 
            category, 
            preview, 
            tagsArr, 
            skillsArr, 
            Number(price) || 0, 
            isFeatured === true, 
            id
        ];

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return NextResponse.json({
                success: false,
                message: 'Project not found, invalid id'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Successfully updated data',
            payload: result.rows[0]
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to update project',
            error: error.message,
        }, { status: 500 });
    }
}