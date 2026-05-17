import { NextResponse } from "next/server";
import { hasRole } from "@/lib/middleware";
import { dbQuery } from "@/lib/database/pg";
import cloudinary from "@/lib/database/cloudinary";

// POST submit application (Public - handles file upload)
export async function POST(req) {
    try {
        const formData = await req.formData();
        
        const job_id = formData.get('job_id');
        const full_name = formData.get('full_name');
        const email = formData.get('email');
        const cover_letter = formData.get('cover_letter');
        const resumeFile = formData.get('resume'); // This should be a File object

        if (!job_id || !full_name || !email || !resumeFile) {
            return NextResponse.json({ success: false, message: "Missing required fields (job_id, full_name, email, resume file)" }, { status: 400 });
        }

        // Upload to Cloudinary
        let resume_url = "";
        try {
            const bytes = await resumeFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Upload via buffer
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: "resumes",
                        resource_type: "auto", // Handles PDF, DOCX, etc.
                        public_id: `resume_${Date.now()}_${full_name.replace(/\s+/g, '_')}`
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
            console.error("Cloudinary upload failed:", uploadError);
            return NextResponse.json({ success: false, message: "Failed to upload resume" }, { status: 500 });
        }

        const query = `
            INSERT INTO career_applications (job_id, full_name, email, resume_url, cover_letter)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const res = await dbQuery(query, [job_id, full_name, email, resume_url, cover_letter]);

        return NextResponse.json({
            success: true,
            message: "Application submitted successfully with resume",
            data: res.rows[0]
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// GET list applications (Admin/HR only)
export async function GET(req) {
    try {
        const auth = await hasRole(['admin', 'manager', 'support']);
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { searchParams } = new URL(req.url);
        const jobId = searchParams.get('jobId');

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

        return NextResponse.json({ success: true, data: res.rows });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PATCH update status (Admin/HR only)
export async function PATCH(req) {
    try {
        const auth = await hasRole(['admin', 'manager', 'support']);
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { appId, status } = await req.json();

        if (!appId || !status) {
            return NextResponse.json({ success: false, message: "App ID and Status are required" }, { status: 400 });
        }

        const res = await dbQuery(
            "UPDATE career_applications SET status = $1 WHERE app_id = $2 RETURNING *",
            [status, appId]
        );

        return NextResponse.json({
            success: true,
            message: "Application status updated",
            data: res.rows[0]
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
