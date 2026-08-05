import { NextResponse } from "next/server";
import { isTeamLogin } from "@/lib/auth/team";
import { dbQuery } from "@/lib/database/pg";

// PATCH — Update business lead
export async function PATCH(req, { params }) {
    try {
        const auth = await isTeamLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const resolvedParams = await params;
        const leadId = resolvedParams.id;
        const body = await req.json();
        const { name, email, phone, address, note } = body;

        const res = await dbQuery(
            `UPDATE business_leads
             SET name = COALESCE(NULLIF($1, ''), name),
                 email = COALESCE(NULLIF($2, ''), email),
                 phone = $3,
                 address = $4,
                 note = $5
             WHERE id = $6
             RETURNING *`,
            [name?.trim(), email?.trim(), phone?.trim() || null, address?.trim() || null, note?.trim() || null, leadId]
        );

        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Business lead not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Business lead updated successfully",
            data: res.rows[0]
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE — Delete business lead
export async function DELETE(req, { params }) {
    try {
        const auth = await isTeamLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const resolvedParams = await params;
        const leadId = resolvedParams.id;

        const res = await dbQuery("DELETE FROM business_leads WHERE id = $1 RETURNING id, name", [leadId]);

        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Business lead not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Business lead deleted successfully"
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
