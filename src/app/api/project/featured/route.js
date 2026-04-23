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

export async function GET() {
    try {
        const res = await dbQuery("SELECT * FROM projects ORDER BY created_at DESC LIMIT 3", []);

        return NextResponse.json({
            success: true,
            message: 'Projects fetched successfully',
            data: res.rows.map(mapProject)
        }, { status: 200 });
        
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ success: false, message: 'Id is required' }, { status: 400 });
        }

        const project = await dbQuery("SELECT * FROM projects WHERE project_id = $1", [id]);

        if (project.rows.length === 0) {
            return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 });
        }

        // Schema constraint: projects table does not have an is_featured column.
        // Returning a mock success to prevent frontend breakages.
        return NextResponse.json({
            success: true,
            message: 'Featured status update is not supported by the current schema',
            data: false
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            message: 'Failed to update featured status', 
            error: error.message 
        }, { status: 500 });
    }
}
