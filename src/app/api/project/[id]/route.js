import { NextResponse } from "next/server";
import { isManager } from "@/lib/middleware";
import { dbQuery } from "@/lib/database/pg";

// GET single project
export async function GET(req, { params }) {
    try {
        const { id } = await params;
        
        const res = await dbQuery(`
            SELECT p.*,
                   (SELECT COALESCE(json_agg(json_build_object('url', i.url, 'is_primary', i.is_primary, 'id', i.image_id)), '[]'::json)
                    FROM images i
                    WHERE i.entity_id = p.project_id AND i.entity_type = 'project') as images
            FROM projects p
            WHERE p.slug = $1 OR p.project_id::text = $1
        `, [id]);
        
        const project = res.rows.length === 0 ? null : res.rows[0];
        
        if (!project) {
            return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: project });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PATCH update project (Manager only)
export async function PATCH(req, { params }) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { id } = await params;
        const body = await req.json();
        const { images, updated_at, created_at, project_id, slug, ...projectData } = body;
        
        let project = null;

        if (Object.keys(projectData).length > 0) {
            const keys = Object.keys(projectData);
            for (const key of keys) {
                if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) {
                    return NextResponse.json({ success: false, message: "Invalid field name" }, { status: 400 });
                }
            }
            const values = Object.values(projectData);
            const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
            
            const query = `
                UPDATE projects 
                SET ${setClause}, updated_at = now() 
                WHERE project_id = $${keys.length + 1} 
                RETURNING *
            `;
            const res = await dbQuery(query, [...values, id]);
            project = res.rows[0];
        }

        // Handle images if provided in update
        if (images && Array.isArray(images)) {
            // Get existing images
            const existingImagesRes = await dbQuery(
                "SELECT * FROM images WHERE entity_type = 'project' AND entity_id = $1",
                [id]
            );
            const existingImages = existingImagesRes.rows;

            const newImageIds = images.map(img => img.id).filter(Boolean);

            // Find images to delete
            const imagesToDelete = existingImages.filter(img => !newImageIds.includes(img.image_id));

            // Delete from DB and Cloudinary
            for (const img of imagesToDelete) {
                await dbQuery("DELETE FROM images WHERE image_id = $1", [img.image_id]);
                if (img.public_id) {
                    try {
                        await cloudinary.uploader.destroy(img.public_id);
                    } catch (error) {
                        console.error("Failed to delete image from Cloudinary:", error);
                    }
                }
            }

            // Insert new images or update existing
            for (const img of images) {
                if (!img.id) { // New image
                    await dbQuery(`
                        INSERT INTO images (url, public_id, entity_type, entity_id, is_primary)
                        VALUES ($1, $2, 'project', $3, $4)
                    `, [img.url, img.public_id, id, img.is_primary || false]);
                } else {
                    // Update is_primary for existing images
                    await dbQuery(`
                        UPDATE images 
                        SET is_primary = $1 
                        WHERE image_id = $2
                    `, [img.is_primary || false, img.id]);
                }
            }
        }

        if (project && auth.data.id) {
            const logQuery = `
                INSERT INTO logs (user_id, action, entity_type, entity_id, description)
                VALUES ($1, $2, $3, $4, $5)
            `;
            await dbQuery(logQuery, [auth.data.id, 'UPDATE', 'project', id, JSON.stringify(body)]);
        }
        
        if (!project) {
            return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Project updated successfully",
            data: project
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE project (Manager only)
export async function DELETE(req, { params }) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { id } = await params;
        
        const res = await dbQuery("DELETE FROM projects WHERE project_id = $1 RETURNING *", [id]);
        const deletedProject = res.rows[0];

        if (deletedProject && auth.data.id) {
            const logQuery = `
                INSERT INTO logs (user_id, action, entity_type, entity_id, description)
                VALUES ($1, $2, $3, $4, $5)
            `;
            await dbQuery(logQuery, [auth.data.id, 'DELETE', 'project', id, JSON.stringify({ title: deletedProject.title })]);
        }

        if (!deletedProject) {
            return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Project deleted successfully",
            data: deletedProject
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
