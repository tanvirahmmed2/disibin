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

export async function GET(req, { params }) {
    try {
        const { slug } = await params;

        if (!slug) {
            return NextResponse.json({ success: false, message: 'slug not found' }, { status: 400 });
        }

        const res = await dbQuery("SELECT * FROM projects WHERE slug = $1", [slug]);

        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: 'No project found with this slug' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'project data found successfully',
            payload: mapProject(res.rows[0])
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
