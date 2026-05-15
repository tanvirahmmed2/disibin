import { dbQuery, transaction } from "../database/pg";
import { addImage } from "./images";
import { createLog } from "./logs";

export async function getProjectBySlug(slug) {
    const res = await dbQuery(`
        SELECT p.*, c.name as category_name,
               (SELECT COALESCE(json_agg(json_build_object('url', i.url, 'is_primary', i.is_primary, 'id', i.image_id)), '[]'::json)
                FROM images i
                WHERE i.entity_id = p.project_id AND i.entity_type = 'project') as images
        FROM projects p
        LEFT JOIN categories c ON p.category_id = c.category_id
        WHERE p.slug = $1 OR p.project_id::text = $1
    `, [slug]);
    
    if (res.rows.length === 0) return null;
    return res.rows[0];
}

export async function getAllProjects() {
    const res = await dbQuery(`
        SELECT p.*, c.name as category_name,
               (SELECT COALESCE(json_agg(json_build_object('url', i.url, 'is_primary', i.is_primary, 'id', i.image_id)), '[]'::json)
                FROM images i
                WHERE i.entity_id = p.project_id AND i.entity_type = 'project') as images,
               (SELECT url FROM images WHERE entity_id = p.project_id AND entity_type = 'project' AND is_primary = true LIMIT 1) as primary_image
        FROM projects p
        LEFT JOIN categories c ON p.category_id = c.category_id
        ORDER BY p.created_at DESC
    `, []);
    return res.rows;
}

export async function createProject(data) {
    return await transaction(async (client) => {
        const { title, slug, description, category_id, live_url, images } = data;
        
        const projectRes = await client.query(`
            INSERT INTO projects (title, slug, description, category_id, live_url)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `, [title, slug, description, category_id, live_url]);
        
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
        await createLog({
            user_id: data.userId || 1, // Fallback if not provided, but usually expected
            action: 'CREATE',
            entity_type: 'project',
            entity_id: project.project_id,
            details: { title: project.title }
        });

        return project;
    });
}

export async function updateProject(id, data, userId) {
    const { images, ...projectData } = data;
    let project = null;

    if (Object.keys(projectData).length > 0) {
        const keys = Object.keys(projectData);
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

    if (images && Array.isArray(images)) {
        for (const img of images) {
            await addImage({
                ...img,
                entity_type: 'project',
                entity_id: id
            });
        }
        if (!project) {
            const res = await dbQuery("SELECT * FROM projects WHERE project_id = $1", [id]);
            project = res.rows[0];
        }
    }

    if (project && userId) {
        await createLog({
            user_id: userId,
            action: 'UPDATE',
            entity_type: 'project',
            entity_id: id,
            details: data
        });
    }

    return project;
}

export async function deleteProject(id, userId) {
    const res = await dbQuery("DELETE FROM projects WHERE project_id = $1 RETURNING *", [id]);
    const project = res.rows[0];

    if (project && userId) {
        await createLog({
            user_id: userId,
            action: 'DELETE',
            entity_type: 'project',
            entity_id: id,
            details: { title: project.title }
        });
    }
    return project;
}

