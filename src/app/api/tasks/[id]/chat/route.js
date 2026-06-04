import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isLogin } from "@/lib/middleware";

export async function GET(req, { params }) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });
        
        const { id } = await params;
        
        const res = await dbQuery(`
            SELECT c.*, u.name as user_name, u.role as user_role, u.image as user_image
            FROM task_comments c
            LEFT JOIN users u ON c.user_id = u.user_id
            WHERE c.task_id = $1
            ORDER BY c.created_at ASC
        `, [id]);
        
        return NextResponse.json({ success: true, data: res.rows });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req, { params }) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });
        
        const { id } = await params;
        const body = await req.json();
        const { content } = body;
        
        if (!content || !content.trim()) {
            return NextResponse.json({ success: false, message: "Content is required" }, { status: 400 });
        }
        
        const res = await dbQuery(`
            INSERT INTO task_comments (task_id, user_id, content)
            VALUES ($1, $2, $3)
            RETURNING *
        `, [id, auth.data.id, content]);
        
        // Fetch the user info to return with the comment
        const comment = res.rows[0];
        const userRes = await dbQuery("SELECT name as user_name, role as user_role, image as user_image FROM users WHERE user_id = $1", [auth.data.id]);
        if (userRes.rows.length > 0) {
            Object.assign(comment, userRes.rows[0]);
        }

        return NextResponse.json({ success: true, data: comment });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
