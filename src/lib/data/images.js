import { dbQuery } from "../database/pg";

export async function addImage(data) {
    const { url, public_id, entity_type, entity_id, is_primary = false } = data;
    
    // If setting as primary, unset other primary images for this entity
    if (is_primary) {
        await dbQuery(
            "UPDATE images SET is_primary = FALSE WHERE entity_type = $1 AND entity_id = $2",
            [entity_type, entity_id]
        );
    }

    const query = `
        INSERT INTO images (url, public_id, entity_type, entity_id, is_primary)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `;
    const res = await dbQuery(query, [url, public_id, entity_type, entity_id, is_primary]);
    return res.rows[0];
}

export async function removeImage(imageId) {
    const res = await dbQuery("DELETE FROM images WHERE image_id = $1 RETURNING *", [imageId]);
    return res.rows[0];
}

export async function setPrimaryImage(imageId, entityType, entityId) {
    await dbQuery(
        "UPDATE images SET is_primary = FALSE WHERE entity_type = $1 AND entity_id = $2",
        [entityType, entityId]
    );
    const res = await dbQuery("UPDATE images SET is_primary = TRUE WHERE image_id = $1 RETURNING *", [imageId]);
    return res.rows[0];
}

export async function getImagesByEntity(entityType, entityId) {
    const res = await dbQuery(
        "SELECT * FROM images WHERE entity_type = $1 AND entity_id = $2 ORDER BY is_primary DESC, created_at DESC",
        [entityType, entityId]
    );
    return res.rows;
}
