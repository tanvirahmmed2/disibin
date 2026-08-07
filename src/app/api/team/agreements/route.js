import { NextResponse } from "next/server";
import { isTeamLogin } from "@/lib/auth/team";
import { dbQuery } from "@/lib/database/pg";
import cloudinary from "@/lib/database/cloudinary";

let tableInitialized = false;

async function ensureAgreementsTable() {
    if (tableInitialized) return;
    try {
        await dbQuery(`
            CREATE TABLE IF NOT EXISTS agreements (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                project_id INT,
                user_id INT,
                file_url TEXT NOT NULL,
                file_id TEXT,
                status VARCHAR(50) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        `);
        tableInitialized = true;
    } catch (error) {
        console.error("Failed to initialize agreements table:", error);
    }
}

// GET — List all agreements for staff
export async function GET() {
    try {
        const auth = await isTeamLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        await ensureAgreementsTable();

        const res = await dbQuery(`
            SELECT a.id, a.title, a.project_id, a.user_id, a.file_url, a.file_id, a.status, a.created_at, a.updated_at,
                   p.title as project_title, u.name as user_name, u.email as user_email
            FROM agreements a
            LEFT JOIN projects p ON a.project_id = p.id
            LEFT JOIN users u ON a.user_id = u.id
            ORDER BY a.created_at DESC
        `);

        return NextResponse.json({ success: true, data: res.rows });
    } catch (error) {
        console.error("GET /api/team/agreements Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST — Create agreement document linking to project and user
export async function POST(req) {
    try {
        const auth = await isTeamLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        await ensureAgreementsTable();

        const formData = await req.formData();
        const title = formData.get("title");
        const project_id = formData.get("project_id");
        const user_id = formData.get("user_id");
        const file = formData.get("file");

        if (!title || !project_id) {
            return NextResponse.json({ success: false, message: "Title and Project ID are required" }, { status: 400 });
        }

        let file_url = "", file_id = "";

        if (file && typeof file === "object" && file.arrayBuffer) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "agreements", resource_type: "auto" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(buffer);
            });
            file_url = uploadResult.secure_url;
            file_id = uploadResult.public_id;
        } else if (typeof file === "string" && file.trim()) {
            file_url = file.trim();
        } else {
            return NextResponse.json({ success: false, message: "Please attach an agreement document file" }, { status: 400 });
        }

        // Get user_id from project if not passed explicitly
        let targetUserId = user_id;
        if (!targetUserId) {
            const pRes = await dbQuery("SELECT user_id FROM projects WHERE id = $1", [project_id]);
            if (pRes.rows.length > 0) targetUserId = pRes.rows[0].user_id;
        }

        const res = await dbQuery(`
            INSERT INTO agreements (title, project_id, user_id, file_url, file_id, status)
            VALUES ($1, $2, $3, $4, $5, 'pending')
            RETURNING *
        `, [title.trim(), project_id, targetUserId || null, file_url, file_id]);

        return NextResponse.json({
            success: true,
            message: "Agreement created successfully!",
            data: res.rows[0]
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
