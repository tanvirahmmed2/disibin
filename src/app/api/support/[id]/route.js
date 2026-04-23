import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isSupport } from "@/lib/middleware";

export async function GET(req, { params }) {
    try {
        const auth = await isSupport();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const { id } = await params;
        if (!id) return NextResponse.json({ success: false, message: 'ID required' }, { status: 400 });

        const res = await dbQuery("SELECT * FROM contacts WHERE contact_id = $1", [id]);
        if (res.rows.length === 0) return NextResponse.json({ success: false, message: 'Support message not found' }, { status: 404 });

        return NextResponse.json({
            success: true,
            message: 'Successfully fetched data',
            payload: { ...res.rows[0], id: res.rows[0].contact_id, _id: res.rows[0].contact_id }
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}