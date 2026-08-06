import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { initLegalTables } from "@/lib/database/initLegalTables";

// GET — Public Refund Policy (latest published record)
export async function GET() {
    try {
        await initLegalTables();

        const res = await dbQuery(`
            SELECT id, title, content, is_published, created_at, updated_at
            FROM refund_conditions
            WHERE is_published = true
            ORDER BY id DESC
            LIMIT 1
        `);

        if (res.rows.length === 0) {
            return NextResponse.json({ success: true, data: null });
        }

        return NextResponse.json({ success: true, data: res.rows[0] });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
