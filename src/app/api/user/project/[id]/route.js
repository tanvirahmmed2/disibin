import { NextResponse } from "next/server";
import { isUserLogin } from "@/lib/auth/user";
import { dbQuery } from "@/lib/database/pg";
import cloudinary from "@/lib/database/cloudinary";

// GET — Fetch project workspace details for customer user
export async function GET(req, { params }) {
    try {
        const auth = await isUserLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const userId = auth.data.id;
        const resolvedParams = await params;
        const projectId = resolvedParams.id;

        // Fetch project
        const projectRes = await dbQuery(`
            SELECT p.id, p.title, p.product_id, p.user_id, p.status, p.created_at, p.updated_at,
                   prod.name as product_name, prod.slug as product_slug, prod.price as product_price, prod.demo_url
            FROM projects p
            LEFT JOIN products prod ON p.product_id = prod.id
            WHERE p.id = $1 AND (p.user_id = $2 OR EXISTS (
                SELECT 1 FROM project_participants pp WHERE pp.project_id = p.id AND pp.user_id = $2
            ))
        `, [projectId, userId]);

        if (projectRes.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Project not found or access denied" }, { status: 404 });
        }

        const project = projectRes.rows[0];

        // Fetch messages
        const messagesRes = await dbQuery(`
            SELECT pm.id, pm.project_id, pm.user_id, pm.team_id, pm.message, pm.created_at,
                   u.name as user_name, t.name as team_name, t.role as team_role
            FROM project_messages pm
            LEFT JOIN users u ON pm.user_id = u.id
            LEFT JOIN teams t ON pm.team_id = t.id
            WHERE pm.project_id = $1
            ORDER BY pm.created_at ASC
        `, [projectId]);

        // Fetch attachments
        const attachmentsRes = await dbQuery(`
            SELECT pa.id, pa.project_id, pa.user_id, pa.team_id, pa.message_id, pa.file_url, pa.file_id, pa.created_at,
                   u.name as user_name, t.name as team_name
            FROM project_attachments pa
            LEFT JOIN users u ON pa.user_id = u.id
            LEFT JOIN teams t ON pa.team_id = t.id
            WHERE pa.project_id = $1
            ORDER BY pa.created_at ASC
        `, [projectId]);

        // Fetch purchases & payments
        const purchasesRes = await dbQuery(`
            SELECT pur.id as purchase_id, pur.product_id, pur.price, pur.discount, pur.status as purchase_status, pur.created_at,
                   pay.id as payment_id, pay.price as payment_price, pay.paid, pay.due, pay.status as payment_status
            FROM purchases pur
            LEFT JOIN payments pay ON pur.id = pay.purchase_id
            WHERE pur.project_id = $1
            ORDER BY pur.created_at DESC
        `, [projectId]);

        // Fetch agreements
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

// POST — Send chat message or attachment file in project workspace
export async function POST(req, { params }) {
    try {
        const auth = await isUserLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const userId = auth.data.id;
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
            }

            // Insert message first (to anchor attachment), then insert attachment linked to message
            if (file_url) {
                // Upload happened — insert message row and link attachment to it
                const msgForFile = await dbQuery(`
                    INSERT INTO project_messages (project_id, user_id, message)
                    VALUES ($1, $2, $3)
                    RETURNING id
                `, [projectId, userId, (messageText && messageText.trim()) || '']);
                const parentMessageId = msgForFile.rows[0].id;

                await dbQuery(`
                    INSERT INTO project_attachments (project_id, user_id, message_id, file_url, file_id)
                    VALUES ($1, $2, $3, $4, $5)
                `, [projectId, userId, parentMessageId, file_url, file_id]);
            } else if (messageText && messageText.trim()) {
                // Text-only message, no file
                await dbQuery(`
                    INSERT INTO project_messages (project_id, user_id, message)
                    VALUES ($1, $2, $3)
                `, [projectId, userId, messageText.trim()]);
            }

            // Touch project updated_at timestamp
            await dbQuery("UPDATE projects SET updated_at = now() WHERE id = $1", [projectId]);

            return NextResponse.json({ success: true, message: "Sent successfully" });

        } else {
            const { message } = await req.json();

            if (!message || !message.trim()) {
                return NextResponse.json({ success: false, message: "Message text is required" }, { status: 400 });
            }

            const res = await dbQuery(`
                INSERT INTO project_messages (project_id, user_id, message)
                VALUES ($1, $2, $3)
                RETURNING *
            `, [projectId, userId, message.trim()]);

            // Touch project updated_at timestamp
            await dbQuery("UPDATE projects SET updated_at = now() WHERE id = $1", [projectId]);

            return NextResponse.json({ success: true, data: res.rows[0] });
        }

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
