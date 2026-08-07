import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";

// GET — Public FAQs (published records)
export async function GET() {
    try {
        const res = await dbQuery(`
            SELECT id, question, answer, order_num, created_at, updated_at
            FROM faqs
            WHERE is_published = true
            ORDER BY order_num ASC, id ASC
        `);

        return NextResponse.json({ success: true, data: res.rows });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
