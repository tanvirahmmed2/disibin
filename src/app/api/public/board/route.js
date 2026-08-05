import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";

// GET — Public board members showcase
export async function GET() {
    try {
        const res = await dbQuery(`
            SELECT id, name, post, email, image, bio, created_at
            FROM boards
            ORDER BY created_at ASC
        `);

        return NextResponse.json({ success: true, data: res.rows });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
