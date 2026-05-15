import { NextResponse } from "next/server";
import { isAdmin, hasRole } from "@/lib/middleware";
import { createJob, getJobs, updateJob, deleteJob } from "@/lib/data/careers";

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

        const jobs = await getJobs(onlyPublished);
        return NextResponse.json({ success: true, data: jobs });
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
        const job = await createJob({
            ...body,
            userId: auth.data.id
        });
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

        const job = await updateJob(jobId, updateData, auth.data.id);
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

        const deletedJob = await deleteJob(jobId, auth.data.id);
        return NextResponse.json({ success: true, message: "Job deleted", data: deletedJob });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
