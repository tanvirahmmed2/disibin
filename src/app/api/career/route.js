import { NextResponse } from "next/server";
import { hasRole } from "@/lib/middleware";
import { dbQuery } from "@/lib/database/pg";

// GET jobs
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const showAll = searchParams.get('all') === 'true';

        let onlyPublished = true;
        if (showAll) {
            const auth = await hasRole(['admin', 'manager']);
            if (auth.success) onlyPublished = false;
        }

        const query = `SELECT * FROM careers ${onlyPublished ? 'WHERE is_published = true' : ''} ORDER BY created_at DESC`;
        const res = await dbQuery(query);
        
        return NextResponse.json({ success: true, data: res.rows });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST create job (Admin only)
export async function POST(req) {
    try {
        const auth = await hasRole(['admin', 'manager']);
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const body = await req.json();
        const { title, location, job_type, level, compensation, description, responsibilities, skills, nice_to_have } = body;

        const query = `
            INSERT INTO careers (title, location, job_type, level, compensation, description, responsibilities, skills, nice_to_have)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `;
        const res = await dbQuery(query, [title, location, job_type, level, compensation, description, responsibilities, skills, nice_to_have]);
        const job = res.rows[0];

        if (job && auth.data.id) {
            const logQuery = `
                INSERT INTO logs (user_id, action, entity_type, entity_id, description)
                VALUES ($1, $2, $3, $4, $5)
            `;
            await dbQuery(logQuery, [auth.data.id, 'CREATE', 'career', job.job_id, JSON.stringify({ title: job.title })]);
        }

        return NextResponse.json({ success: true, data: job }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PATCH update job (Admin only)
export async function PATCH(req) {
    try {
        const auth = await hasRole(['admin', 'manager']);
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const body = await req.json();
        const { jobId, ...updateData } = body;

        if (!jobId) {
            return NextResponse.json({ success: false, message: "Job ID is required" }, { status: 400 });
        }

        const keys = Object.keys(updateData);
        if (keys.length === 0) {
            return NextResponse.json({ success: false, message: "No fields to update" }, { status: 400 });
        }

        const values = Object.values(updateData);
        const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
        
        const query = `UPDATE careers SET ${setClause} WHERE job_id = $${keys.length + 1} RETURNING *`;
        const res = await dbQuery(query, [...values, jobId]);
        const job = res.rows[0];

        if (job && auth.data.id) {
            const logQuery = `
                INSERT INTO logs (user_id, action, entity_type, entity_id, description)
                VALUES ($1, $2, $3, $4, $5)
            `;
            await dbQuery(logQuery, [auth.data.id, 'UPDATE', 'career', jobId, JSON.stringify(updateData)]);
        }

        return NextResponse.json({ success: true, data: job });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE job (Admin only)
export async function DELETE(req) {
    try {
        const auth = await hasRole(['admin', 'manager']);
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { searchParams } = new URL(req.url);
        const jobId = searchParams.get('id');

        if (!jobId) {
            return NextResponse.json({ success: false, message: "Job ID is required" }, { status: 400 });
        }

        const res = await dbQuery("DELETE FROM careers WHERE job_id = $1 RETURNING *", [jobId]);
        const job = res.rows[0];

        if (job && auth.data.id) {
            const logQuery = `
                INSERT INTO logs (user_id, action, entity_type, entity_id, description)
                VALUES ($1, $2, $3, $4, $5)
            `;
            await dbQuery(logQuery, [auth.data.id, 'DELETE', 'career', jobId, JSON.stringify({ title: job.title })]);
        }

        return NextResponse.json({ success: true, message: "Job deleted", data: job });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
