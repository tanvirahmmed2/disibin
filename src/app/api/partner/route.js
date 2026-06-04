import { NextResponse } from "next/server";
import { isManager } from "@/lib/middleware";
import { dbQuery } from "@/lib/database/pg";
import cloudinary from "@/lib/database/cloudinary";

// GET all partners (Public)
export async function GET() {
    try {
        const res = await dbQuery("SELECT * FROM partners ORDER BY created_at ASC");
        return NextResponse.json({ success: true, data: res.rows });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST create partner (Manager only)
export async function POST(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { name, logo, logo_id, description } = await req.json();

        if (!name) {
            return NextResponse.json({ success: false, message: "Partner name is required" }, { status: 400 });
        }

        const res = await dbQuery(
            `INSERT INTO partners (name, logo, logo_id, description) VALUES ($1, $2, $3, $4) RETURNING *`,
            [name, logo || null, logo_id || null, description || null]
        );

        return NextResponse.json({
            success: true,
            message: "Partner added successfully",
            data: res.rows[0]
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PATCH update partner (Manager only)
export async function PATCH(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { partnerId, name, logo, logo_id, description } = await req.json();

        if (!partnerId) {
            return NextResponse.json({ success: false, message: "Partner ID is required" }, { status: 400 });
        }

        // If a new logo is being set and the old one had a logo_id, delete it from Cloudinary
        if (logo_id !== undefined) {
            const oldRes = await dbQuery("SELECT logo_id FROM partners WHERE partner_id = $1", [partnerId]);
            const oldLogoId = oldRes.rows[0]?.logo_id;
            if (oldLogoId && oldLogoId !== logo_id) {
                try {
                    await cloudinary.uploader.destroy(oldLogoId);
                } catch (err) {
                    console.error("Cloudinary delete (old logo on update) failed:", err.message);
                }
            }
        }

        const res = await dbQuery(
            `UPDATE partners
             SET name = $1, logo = $2, logo_id = $3, description = $4, updated_at = now()
             WHERE partner_id = $5
             RETURNING *`,
            [name, logo || null, logo_id || null, description || null, partnerId]
        );

        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Partner not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Partner updated successfully",
            data: res.rows[0]
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE partner (Manager only) — also removes logo from Cloudinary
export async function DELETE(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { searchParams } = new URL(req.url);
        const partnerId = searchParams.get("id");

        if (!partnerId) {
            return NextResponse.json({ success: false, message: "Partner ID is required" }, { status: 400 });
        }

        const res = await dbQuery(
            "DELETE FROM partners WHERE partner_id = $1 RETURNING *",
            [partnerId]
        );

        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Partner not found" }, { status: 404 });
        }

        const deleted = res.rows[0];

        // Remove logo from Cloudinary if it was uploaded there
        if (deleted.logo_id) {
            try {
                await cloudinary.uploader.destroy(deleted.logo_id);
            } catch (err) {
                console.error("Cloudinary delete failed:", err.message);
                // Don't block the response — DB record is already gone
            }
        }

        return NextResponse.json({
            success: true,
            message: "Partner removed",
            data: deleted
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
