import { dbQuery } from "../database/pg";
import { createLog } from "./logs";

// Career (Job Listings)
export async function createJob(data) {
    const { title, location, job_type, level, compensation, description, responsibilities, skills, nice_to_have } = data;
    const query = `
        INSERT INTO careers (title, location, job_type, level, compensation, description, responsibilities, skills, nice_to_have)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
    `;
    const res = await dbQuery(query, [title, location, job_type, level, compensation, description, responsibilities, skills, nice_to_have]);
    const job = res.rows[0];

    if (job && data.userId) {
        await createLog({
            user_id: data.userId,
            action: 'CREATE',
            entity_type: 'career',
            entity_id: job.job_id,
            details: { title: job.title }
        });
    }

    return job;
}

export async function getJobs(onlyPublished = true) {
    const query = `SELECT * FROM careers ${onlyPublished ? 'WHERE is_published = true' : ''} ORDER BY created_at DESC`;
    const res = await dbQuery(query);
    return res.rows;
}

export async function updateJob(id, data, userId) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
    const query = `UPDATE careers SET ${setClause} WHERE job_id = $${keys.length + 1} RETURNING *`;
    const res = await dbQuery(query, [...values, id]);
    const job = res.rows[0];

    if (job && userId) {
        await createLog({
            user_id: userId,
            action: 'UPDATE',
            entity_type: 'career',
            entity_id: id,
            details: data
        });
    }

    return job;
}

export async function deleteJob(id, userId) {
    const res = await dbQuery("DELETE FROM careers WHERE job_id = $1 RETURNING *", [id]);
    const job = res.rows[0];

    if (job && userId) {
        await createLog({
            user_id: userId,
            action: 'DELETE',
            entity_type: 'career',
            entity_id: id,
            details: { title: job.title }
        });
    }
    return job;
}

// Career Applications
export async function submitApplication(data) {
    const { job_id, full_name, email, resume_url, cover_letter } = data;
    const query = `
        INSERT INTO career_applications (job_id, full_name, email, resume_url, cover_letter)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `;
    const res = await dbQuery(query, [job_id, full_name, email, resume_url, cover_letter]);
    return res.rows[0];
}

export async function getApplications(jobId = null) {
    let query = `
        SELECT ca.*, c.title as job_title
        FROM career_applications ca
        LEFT JOIN careers c ON ca.job_id = c.job_id
    `;
    const params = [];
    if (jobId) {
        query += " WHERE ca.job_id = $1";
        params.push(jobId);
    }
    query += " ORDER BY ca.created_at DESC";
    const res = await dbQuery(query, params);
    return res.rows;
}

export async function updateApplicationStatus(appId, status) {
    const res = await dbQuery(
        "UPDATE career_applications SET status = $1 WHERE app_id = $2 RETURNING *",
        [status, appId]
    );
    return res.rows[0];
}
