import { NextResponse } from "next/server";
import { isTeamLogin } from "@/lib/auth/team";
import { dbQuery } from "@/lib/database/pg";

// PATCH — Update an existing client lead (Team roles only)
export async function PATCH(req, { params }) {
    try {
        const auth = await isTeamLogin();
        if (!auth.success) {
            return NextResponse.json(auth, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const { name, email, phone, address, note } = body;

        if (!name || !email) {
            return NextResponse.json(
                { success: false, message: "Client name and email are required" },
                { status: 400 }
            );
        }

        const res = await dbQuery(
            `UPDATE client_leads
             SET name = $1, email = $2, phone = $3, address = $4, note = $5
             WHERE id = $6
             RETURNING *`,
            [
                name.trim(),
                email.trim(),
                phone?.trim() || null,
                address?.trim() || null,
                note?.trim() || null,
                id
            ]
        );

        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Client lead not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Client lead updated successfully",
            data: res.rows[0]
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE — Remove a client lead (Team roles only)
export async function DELETE(req, { params }) {
    try {
        const auth = await isTeamLogin();
        if (!auth.success) {
            return NextResponse.json(auth, { status: 401 });
        }

        const { id } = await params;

        const res = await dbQuery("DELETE FROM client_leads WHERE id = $1 RETURNING *", [id]);

        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Client lead not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Client lead deleted successfully",
            data: res.rows[0]
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
