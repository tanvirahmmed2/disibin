import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";

const mapBlog = (row) => ({
    ...row,
    id: row.blog_id,
    _id: row.blog_id,
    title: row.title,
    image: row.image,
    imageId: row.image_id,
    authorId: {
        _id: row.author_id,
        name: row.author_name
    }
});

export async function GET(req, { params }) {
    try {
        const { slug } = await params;

        if (!slug) {
            return NextResponse.json({ success: false, message: 'identifier not found' }, { status: 400 });
        }

        // Try searching by slug or ID
        let res;
        if (!isNaN(parseInt(slug))) {
            res = await dbQuery(`
                SELECT b.*, u.name as author_name 
                FROM blogs b
                LEFT JOIN users u ON b.author_id = u.user_id
                WHERE b.blog_id = $1 OR b.slug = $2
            `, [parseInt(slug), slug]);
        } else {
            res = await dbQuery(`
                SELECT b.*, u.name as author_name 
                FROM blogs b
                LEFT JOIN users u ON b.author_id = u.user_id
                WHERE b.slug = $1
            `, [slug]);
        }

        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: 'No blog found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'blog data found successfully',
            payload: mapBlog(res.rows[0])
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
