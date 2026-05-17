import { NextResponse } from "next/server";
import { isSupport } from "@/lib/middleware";
import { dbQuery } from "@/lib/database/pg";

// PATCH update support request (Reply)
export async function PATCH(req, { params }) {
    try {
        const auth = await isSupport();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const { id } = await params;
        
        // Check if request exists
        const checkRes = await dbQuery("SELECT * FROM supports WHERE support_id = $1", [id]);
        if (checkRes.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Support request not found" }, { status: 404 });
        }

        const query = `
            UPDATE supports 
            SET status = 'replied', responded_by = $1
            WHERE support_id = $2
            RETURNING *
        `;
        const res = await dbQuery(query, [auth.data.id, id]);

        return NextResponse.json({
            success: true,
            message: "Support request marked as replied",
            data: res.rows[0]
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE support request
export async function DELETE(req, { params }) {
    try {
        const auth = await isSupport();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const { id } = await params;
        
        const res = await dbQuery("DELETE FROM supports WHERE support_id = $1 RETURNING *", [id]);
        
        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Support request not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Support request deleted successfully",
            data: res.rows[0]
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
