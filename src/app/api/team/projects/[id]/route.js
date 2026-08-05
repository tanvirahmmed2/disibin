import { NextResponse } from "next/server";
import { isTeamLogin } from "@/lib/auth/team";
import { dbQuery } from "@/lib/database/pg";
import cloudinary from "@/lib/database/cloudinary";

// GET — Fetch project workspace details for team staff
export async function GET(req, { params }) {
    try {
        const auth = await isTeamLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const resolvedParams = await params;
        const projectId = resolvedParams.id;

        const projectRes = await dbQuery(`
            SELECT p.id, p.title, p.product_id, p.user_id, p.team_id, p.status, p.created_at, p.updated_at,
                   prod.name as product_name, prod.slug as product_slug, prod.price as product_price,
                   u.name as user_name, u.email as user_email, u.phone as user_phone
            FROM projects p
            LEFT JOIN products prod ON p.product_id = prod.id
            LEFT JOIN users u ON p.user_id = u.id
            WHERE p.id = $1
        `, [projectId]);

        if (projectRes.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
        }

        const project = projectRes.rows[0];

        // Messages
        const messagesRes = await dbQuery(`
            SELECT pm.id, pm.project_id, pm.user_id, pm.team_id, pm.message, pm.created_at,
                   u.name as user_name, t.name as team_name, t.role as team_role
            FROM project_messages pm
            LEFT JOIN users u ON pm.user_id = u.id
            LEFT JOIN teams t ON pm.team_id = t.id
            WHERE pm.project_id = $1
            ORDER BY pm.created_at ASC
        `, [projectId]);

        // Attachments
        const attachmentsRes = await dbQuery(`
            SELECT pa.id, pa.project_id, pa.user_id, pa.team_id, pa.file_url, pa.file_id, pa.created_at,
                   u.name as user_name, t.name as team_name
            FROM project_attachments pa
            LEFT JOIN users u ON pa.user_id = u.id
            LEFT JOIN teams t ON pa.team_id = t.id
            WHERE pa.project_id = $1
            ORDER BY pa.created_at DESC
        `, [projectId]);

        // Purchases & Payments
        const purchasesRes = await dbQuery(`
            SELECT pur.id as purchase_id, pur.product_id, pur.price, pur.discount, pur.status as purchase_status, pur.created_at,
                   pay.id as payment_id, pay.price as payment_price, pay.paid, pay.due, pay.status as payment_status
            FROM purchases pur
            LEFT JOIN payments pay ON pur.id = pay.purchase_id
            WHERE pur.project_id = $1
            ORDER BY pur.created_at DESC
        `, [projectId]);

        // Agreements
        const agreementsRes = await dbQuery(`
            SELECT id, title, file_url, status, created_at, updated_at
            FROM agreements
            WHERE project_id = $1
            ORDER BY created_at DESC
        `, [projectId]).catch(() => ({ rows: [] }));

        return NextResponse.json({
            success: true,
            data: {
                project,
                messages: messagesRes.rows,
                attachments: attachmentsRes.rows,
                purchases: purchasesRes.rows,
                agreements: agreementsRes.rows
            }
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST — Send message or upload file attachment from staff
export async function POST(req, { params }) {
    try {
        const auth = await isTeamLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const teamId = auth.data.id;
        const resolvedParams = await params;
        const projectId = resolvedParams.id;

        const contentType = req.headers.get("content-type") || "";

        if (contentType.includes("multipart/form-data")) {
            const formData = await req.formData();
            const file = formData.get("file");
            const messageText = formData.get("message");

            let file_url = "", file_id = "";

            if (file && typeof file === "object" && file.arrayBuffer) {
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const uploadResult = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { folder: "project_attachments", resource_type: "auto" },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    uploadStream.end(buffer);
                });
                file_url = uploadResult.secure_url;
                file_id = uploadResult.public_id;

                await dbQuery(`
                    INSERT INTO project_attachments (project_id, team_id, file_url, file_id)
                    VALUES ($1, $2, $3, $4)
                `, [projectId, teamId, file_url, file_id]);
            }

            if (messageText && messageText.trim()) {
                await dbQuery(`
                    INSERT INTO project_messages (project_id, team_id, message)
                    VALUES ($1, $2, $3)
                `, [projectId, teamId, messageText.trim()]);
            }

            await dbQuery("UPDATE projects SET updated_at = now() WHERE id = $1", [projectId]);

            return NextResponse.json({ success: true, message: "Staff message sent" });

        } else {
            const { message } = await req.json();

            if (!message || !message.trim()) {
                return NextResponse.json({ success: false, message: "Message is required" }, { status: 400 });
            }

            const res = await dbQuery(`
                INSERT INTO project_messages (project_id, team_id, message)
                VALUES ($1, $2, $3)
                RETURNING *
            `, [projectId, teamId, message.trim()]);

            await dbQuery("UPDATE projects SET updated_at = now() WHERE id = $1", [projectId]);

            return NextResponse.json({ success: true, data: res.rows[0] });
        }

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PATCH — Update project status (Staff only)
export async function PATCH(req, { params }) {
    try {
        const auth = await isTeamLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const resolvedParams = await params;
        const projectId = resolvedParams.id;

        const { status } = await req.json();

        const validStatuses = ['pending', 'working', 'ready', 'ontest', 'fixing', 'approved'];
        if (!status || !validStatuses.includes(status)) {
            return NextResponse.json({ success: false, message: "Invalid project status" }, { status: 400 });
        }

        const res = await dbQuery(`
            UPDATE projects
            SET status = $1, updated_at = now()
            WHERE id = $2
            RETURNING *
        `, [status, projectId]);

        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: `Project status updated to ${status}`,
            data: res.rows[0]
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
