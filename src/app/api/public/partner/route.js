import { NextResponse } from "next/server";
import { isManager } from "@/lib/auth/team";
import { dbQuery } from "@/lib/database/pg";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

function slugify(text) {
    return text.toString().toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
}

// GET - List all partners (Public)
export async function GET() {
    try {
        const res = await dbQuery(`
            SELECT id, company_name, slug, business_url, image, image_id, email, created_at
            FROM partners
            ORDER BY created_at DESC
        `);
        return NextResponse.json({ success: true, data: res.rows });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST - Create a partner (Manager only)
export async function POST(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const body = await req.json();
        const { company_name, slug, business_url, image, image_id, email } = body;

        if (!company_name || !company_name.trim()) {
            return NextResponse.json({ success: false, message: "Company name is required" }, { status: 400 });
        }
        if (!image) {
            return NextResponse.json({ success: false, message: "Company logo/image is required" }, { status: 400 });
        }
        if (!email || !email.trim()) {
            return NextResponse.json({ success: false, message: "Contact email is required" }, { status: 400 });
        }

        const partnerSlug = (slug || slugify(company_name)).trim();
        const url = (business_url || "").trim() || "#";

        const res = await dbQuery(`
            INSERT INTO partners (company_name, slug, business_url, image, image_id, email)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, company_name, slug, business_url, image, image_id, email, created_at
        `, [company_name.trim(), partnerSlug, url, image, image_id || 'logo_' + Date.now(), email.trim()]);

        const newPartner = res.rows[0];

        // Record activity log
        await dbQuery(`
            INSERT INTO activity_logs (team_id, action, entity_type, entity_id, description)
            VALUES ($1, $2, $3, $4, $5)
        `, [auth.data.id, 'PARTNER_CREATE', 'partner', newPartner.id, `Added partner "${company_name}"`]).catch(() => {});

        return NextResponse.json({
            success: true,
            message: "Partner created successfully",
            data: newPartner
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PATCH - Update partner (Manager only)
export async function PATCH(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const body = await req.json();
        const { id, company_name, slug, business_url, image, image_id, email } = body;

        if (!id) {
            return NextResponse.json({ success: false, message: "Partner ID is required" }, { status: 400 });
        }

        // Fetch old partner info
        const oldRes = await dbQuery("SELECT image_id FROM partners WHERE id = $1", [id]);
        if (oldRes.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Partner not found" }, { status: 404 });
        }

        const oldImageId = oldRes.rows[0].image_id;

        // If image replaced and oldImageId differs, remove old Cloudinary image
        if (image && image_id && oldImageId && oldImageId !== image_id) {
            try { await cloudinary.uploader.destroy(oldImageId); } catch {}
        }

        const partnerSlug = (slug || (company_name ? slugify(company_name) : '')).trim();

        const res = await dbQuery(`
            UPDATE partners
            SET company_name = COALESCE(NULLIF($1, ''), company_name),
                slug = COALESCE(NULLIF($2, ''), slug),
                business_url = COALESCE(NULLIF($3, ''), business_url),
                image = COALESCE(NULLIF($4, ''), image),
                image_id = COALESCE(NULLIF($5, ''), image_id),
                email = COALESCE(NULLIF($6, ''), email)
            WHERE id = $7
            RETURNING id, company_name, slug, business_url, image, image_id, email, created_at
        `, [company_name?.trim(), partnerSlug, business_url?.trim(), image, image_id, email?.trim(), id]);

        return NextResponse.json({
            success: true,
            message: "Partner updated successfully",
            data: res.rows[0]
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE - Delete partner (Manager only)
export async function DELETE(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ success: false, message: "Partner ID is required" }, { status: 400 });
        }

        const res = await dbQuery("DELETE FROM partners WHERE id = $1 RETURNING id, company_name, image_id", [id]);
        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Partner not found" }, { status: 404 });
        }

        const deleted = res.rows[0];
        if (deleted.image_id) {
            try { await cloudinary.uploader.destroy(deleted.image_id); } catch {}
        }

        return NextResponse.json({
            success: true,
            message: "Partner deleted successfully",
            data: deleted
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
