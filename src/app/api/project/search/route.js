import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";

const mapProject = (row) => ({
    ...row,
    id: row.project_id,
    _id: row.project_id,
    title: row.title,
    image: row.image,
    imageId: row.image_id,
    preview: row.live_url
});

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q');

        if (!query) {
            return NextResponse.json({ success: false, message: 'Search query is required' }, { status: 400 });
        }

        const searchTerm = `%${query}%`;
        const res = await dbQuery(`
            SELECT p.*, c.name as category_name
            FROM projects p
            LEFT JOIN categories c ON p.category_id = c.category_id
            WHERE p.title ILIKE $1 
               OR p.description ILIKE $1 
               OR c.name ILIKE $1
            ORDER BY p.created_at DESC
        `, [searchTerm]);

        return NextResponse.json({
            success: true,
            message: 'Search results found',
            data: res.rows.map(mapProject)
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
