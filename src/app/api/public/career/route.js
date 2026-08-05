import { NextResponse } from "next/server";
import { isManager } from "@/lib/auth/team";
import { dbQuery } from "@/lib/database/pg";

function toPgArray(arr) {
    if (!arr) return null;
    if (Array.isArray(arr)) {
        const cleaned = arr.map(item => typeof item === 'string' ? item.trim() : item).filter(Boolean);
        return cleaned.length > 0 ? cleaned : null;
    }
    if (typeof arr === 'string') {
        const parts = arr.split(',').map(s => s.trim()).filter(Boolean);
        return parts.length > 0 ? parts : null;
    }
    return null;
}

// GET jobs
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const showAll = searchParams.get('all') === 'true';

        let onlyPublished = true;
        if (showAll) {
            const auth = await isManager();
            if (auth.success) onlyPublished = false;
        }

        const query = `
            SELECT job_id, title, location, job_type, level, compensation, description,
                   responsibilities, skills, nice_to_have, is_published, created_at
            FROM careers
            ${onlyPublished ? 'WHERE is_published = true' : ''}
            ORDER BY created_at DESC
        `;
        const res = await dbQuery(query);

        return NextResponse.json({ success: true, data: res.rows });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST create job (Manager only)
export async function POST(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const body = await req.json();
        const { title, location, job_type, level, compensation, description, responsibilities, skills, nice_to_have, is_published } = body;

        if (!title || !title.trim()) {
            return NextResponse.json({ success: false, message: "Job title is required" }, { status: 400 });
        }

        const query = `
            INSERT INTO careers (
                title, location, job_type, level, compensation, description,
                responsibilities, skills, nice_to_have, is_published
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `;
        const params = [
            title.trim(),
            (location || "Remote").trim(),
            (job_type || "Full-time").trim(),
            (level || "Mid-Level").trim(),
            (compensation || "").trim() || null,
            (description || "").trim(),
            toPgArray(responsibilities),
            toPgArray(skills),
            toPgArray(nice_to_have),
            is_published !== undefined ? Boolean(is_published) : true
        ];

        const res = await dbQuery(query, params);
        const job = res.rows[0];

        // Record activity log
        await dbQuery(`
            INSERT INTO activity_logs (team_id, action, entity_type, entity_id, description)
            VALUES ($1, 'CAREER_CREATE', 'career', $2, $3)
        `, [auth.data.id, job.job_id, `Created job posting "${job.title}"`]).catch(() => {});

        return NextResponse.json({ success: true, data: job }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PATCH update job (Manager only)
export async function PATCH(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const body = await req.json();
        const { jobId, title, location, job_type, level, compensation, description, responsibilities, skills, nice_to_have, is_published } = body;

        if (!jobId) {
            return NextResponse.json({ success: false, message: "Job ID is required" }, { status: 400 });
        }

        const query = `
            UPDATE careers
            SET title = COALESCE(NULLIF($1, ''), title),
                location = COALESCE(NULLIF($2, ''), location),
                job_type = COALESCE(NULLIF($3, ''), job_type),
                level = COALESCE(NULLIF($4, ''), level),
                compensation = $5,
                description = COALESCE(NULLIF($6, ''), description),
                responsibilities = COALESCE($7, responsibilities),
                skills = COALESCE($8, skills),
                nice_to_have = COALESCE($9, nice_to_have),
                is_published = COALESCE($10, is_published)
            WHERE job_id = $11
            RETURNING *
        `;
        const params = [
            title?.trim(),
            location?.trim(),
            job_type?.trim(),
            level?.trim(),
            compensation !== undefined ? (compensation?.trim() || null) : null,
            description?.trim(),
            responsibilities !== undefined ? toPgArray(responsibilities) : null,
            skills !== undefined ? toPgArray(skills) : null,
            nice_to_have !== undefined ? toPgArray(nice_to_have) : null,
            is_published !== undefined ? Boolean(is_published) : null,
            jobId
        ];

        const res = await dbQuery(query, params);
        const job = res.rows[0];

        if (!job) {
            return NextResponse.json({ success: false, message: "Job position not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: job });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE job (Manager only)
export async function DELETE(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { searchParams } = new URL(req.url);
        const jobId = searchParams.get('id');

        if (!jobId) {
            return NextResponse.json({ success: false, message: "Job ID is required" }, { status: 400 });
        }

        const res = await dbQuery("DELETE FROM careers WHERE job_id = $1 RETURNING *", [jobId]);
        const job = res.rows[0];

        if (!job) {
            return NextResponse.json({ success: false, message: "Job not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Job deleted", data: job });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
