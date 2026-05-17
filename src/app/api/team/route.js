import { NextResponse } from "next/server";
import { isManager } from "@/lib/middleware";
import { dbQuery } from "@/lib/database/pg";

// GET team members (Public)
export async function GET() {
    try {
        const res = await dbQuery("SELECT * FROM teams ORDER BY created_at ASC");
        return NextResponse.json({ success: true, data: res.rows });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST add member (Manager only)
export async function POST(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const body = await req.json();
        const { name, post, email, image, image_id, bio } = body;

        if (!name || !post) {
            return NextResponse.json({ success: false, message: "Name and Post (Title) are required" }, { status: 400 });
        }

        const query = `
            INSERT INTO teams (name, post, email, image, image_id, bio)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const res = await dbQuery(query, [name, post, email, image, image_id, bio]);

        return NextResponse.json({
            success: true,
            message: "Team member added successfully",
            data: res.rows[0]
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PATCH update member (Manager only)
export async function PATCH(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const body = await req.json();
        const { memberId, ...updateData } = body;

        if (!memberId) {
            return NextResponse.json({ success: false, message: "Member ID is required" }, { status: 400 });
        }

        const keys = Object.keys(updateData);
        if (keys.length === 0) {
            return NextResponse.json({ success: false, message: "No fields to update" }, { status: 400 });
        }

        const values = Object.values(updateData);
        const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
        
        const query = `UPDATE teams SET ${setClause} WHERE member_id = $${keys.length + 1} RETURNING *`;
        const res = await dbQuery(query, [...values, memberId]);

        if (res.rows.length === 0) return NextResponse.json({ success: false, message: "Member not found" }, { status: 404 });

        return NextResponse.json({
            success: true,
            message: "Team member updated successfully",
            data: res.rows[0]
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE member (Manager only)
export async function DELETE(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { searchParams } = new URL(req.url);
        const memberId = searchParams.get('id');

        if (!memberId) {
            return NextResponse.json({ success: false, message: "Member ID is required" }, { status: 400 });
        }

        const res = await dbQuery("DELETE FROM teams WHERE member_id = $1 RETURNING *", [memberId]);
        
        if (res.rows.length === 0) return NextResponse.json({ success: false, message: "Member not found" }, { status: 404 });

        return NextResponse.json({
            success: true,
            message: "Team member removed",
            data: res.rows[0]
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
