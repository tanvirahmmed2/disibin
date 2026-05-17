import { NextResponse } from "next/server";
import { isManager } from "@/lib/middleware";
import { dbQuery, transaction } from "@/lib/database/pg";

// GET all projects (Public)
export async function GET() {
    try {
        const res = await dbQuery(`
            SELECT p.*,
                   (SELECT COALESCE(json_agg(json_build_object('url', i.url, 'is_primary', i.is_primary, 'id', i.image_id)), '[]'::json)
                    FROM images i
                    WHERE i.entity_id = p.project_id AND i.entity_type = 'project') as images,
                   (SELECT url FROM images WHERE entity_id = p.project_id AND entity_type = 'project' AND is_primary = true LIMIT 1) as primary_image
            FROM projects p
            ORDER BY p.created_at DESC
        `, []);
        
        return NextResponse.json({ success: true, data: res.rows });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST create project (Manager only)
export async function POST(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const body = await req.json();
        const { title, slug, description, live_url, images } = body;

        if (!title || !slug) {
            return NextResponse.json({ success: false, message: "Title and slug are required" }, { status: 400 });
        }

        const project = await transaction(async (client) => {
            const projectRes = await client.query(`
                INSERT INTO projects (title, slug, description, live_url)
                VALUES ($1, $2, $3, $4)
                RETURNING *
            `, [title, slug, description, live_url]);
            
            const project = projectRes.rows[0];

            if (images && Array.isArray(images)) {
                for (const img of images) {
                    await client.query(`
                        INSERT INTO images (url, public_id, entity_type, entity_id, is_primary)
                        VALUES ($1, $2, 'project', $3, $4)
                    `, [img.url, img.public_id, project.project_id, img.is_primary || false]);
                }
            }

            // Log the action
            const logQuery = `
                INSERT INTO logs (user_id, action, entity_type, entity_id, description)
                VALUES ($1, $2, $3, $4, $5)
            `;
            await client.query(logQuery, [auth.data.id, 'CREATE', 'project', project.project_id, JSON.stringify({ title: project.title })]);

            return project;
        });

        return NextResponse.json({
            success: true,
            message: "Project created successfully",
            data: project
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
