import { NextResponse } from "next/server";
import { isManager } from "@/lib/auth/team";
import { dbQuery } from "@/lib/database/pg";
import cloudinary from "@/lib/database/cloudinary";

// POST submit job application (Public candidate submission with resume upload)
export async function POST(req) {
    try {
        const formData = await req.formData();

        const job_id = formData.get('job_id');
        const full_name = formData.get('full_name');
        const email = formData.get('email');
        const cover_letter = formData.get('cover_letter');
        const resumeFile = formData.get('resume'); // File object

        if (!job_id || !full_name || !email) {
            return NextResponse.json({ success: false, message: "Missing required fields (job_id, full_name, email)" }, { status: 400 });
        }

        // Upload resume to Cloudinary if provided as a File or String
        let resume_url = "";

        if (resumeFile && typeof resumeFile === 'object' && resumeFile.arrayBuffer) {
            try {
                const bytes = await resumeFile.arrayBuffer();
                const buffer = Buffer.from(bytes);

                const uploadResult = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: "resumes",
                            resource_type: "auto",
                            public_id: `resume_${Date.now()}_${full_name.trim().replace(/\s+/g, '_')}`
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    uploadStream.end(buffer);
                });

                resume_url = uploadResult.secure_url;
            } catch (uploadError) {
                console.error("Cloudinary resume upload failed:", uploadError);
                return NextResponse.json({ success: false, message: "Failed to upload resume document" }, { status: 500 });
            }
        } else if (typeof resumeFile === 'string' && resumeFile.trim()) {
            resume_url = resumeFile.trim();
        } else {
            return NextResponse.json({ success: false, message: "Please attach a resume file" }, { status: 400 });
        }

        const query = `
            INSERT INTO career_applications (job_id, full_name, email, resume_url, cover_letter, status)
            VALUES ($1, $2, $3, $4, $5, 'applied')
            RETURNING app_id, job_id, full_name, email, resume_url, cover_letter, status, created_at
        `;
        const res = await dbQuery(query, [
            parseInt(job_id),
            full_name.trim(),
            email.trim().toLowerCase(),
            resume_url,
            cover_letter ? cover_letter.trim() : null
        ]);

        return NextResponse.json({
            success: true,
            message: "Application submitted successfully!",
            data: res.rows[0]
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// GET list applications (Manager only)
export async function GET(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { searchParams } = new URL(req.url);
        const jobId = searchParams.get('jobId');

        let query = `
            SELECT ca.app_id, ca.job_id, ca.full_name, ca.email, ca.resume_url,
                   ca.cover_letter, ca.status, ca.created_at, c.title as job_title
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

        return NextResponse.json({ success: true, data: res.rows });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PATCH update status (Manager only)
export async function PATCH(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { appId, status } = await req.json();

        if (!appId || !status) {
            return NextResponse.json({ success: false, message: "App ID and Status are required" }, { status: 400 });
        }

        const validStatuses = ['applied', 'interviewing', 'rejected', 'hired'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ success: false, message: "Invalid application status" }, { status: 400 });
        }

        const res = await dbQuery(
            "UPDATE career_applications SET status = $1 WHERE app_id = $2 RETURNING *",
            [status, appId]
        );

        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Application not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: `Application status updated to ${status}`,
            data: res.rows[0]
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE application (Manager only)
export async function DELETE(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { searchParams } = new URL(req.url);
        const appId = searchParams.get('id');

        if (!appId) {
            return NextResponse.json({ success: false, message: "Application ID is required" }, { status: 400 });
        }

        const res = await dbQuery("DELETE FROM career_applications WHERE app_id = $1 RETURNING app_id", [appId]);
        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Application not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Application deleted successfully"
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
