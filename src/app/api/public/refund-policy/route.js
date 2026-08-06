import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { initLegalTables } from "@/lib/database/initLegalTables";

// GET — Public Refund Policy items (all published records)
export async function GET() {
    try {
        await initLegalTables();

        const res = await dbQuery(`
            SELECT id, title, content, order_num, created_at, updated_at
            FROM refund_conditions
            WHERE is_published = true
            ORDER BY order_num ASC, id ASC
        `);

        return NextResponse.json({ success: true, data: res.rows });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
