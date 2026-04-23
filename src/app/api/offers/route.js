import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isLogin, isManager } from "@/lib/middleware";

const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get('slug');

        if (slug) {
            // If slug is provided, we look for the coupon by code (serving as slug for offers)
            const res = await dbQuery(`
                SELECT c.*, p.name, p.description, p.price as original_price, p.image, p.duration_days, p.features, p.slug as package_slug
                FROM coupons c
                JOIN packages p ON c.package_id = p.package_id
                WHERE c.code = $1 AND c.status = 'active'
            `, [slug]);

            if (res.rows.length === 0) {
                return NextResponse.json({ success: false, message: "Offer not found" }, { status: 404 });
            }

            const offer = res.rows[0];
            const discountAmount = offer.is_percentage ? (offer.original_price * offer.discount / 100) : offer.discount;
            offer.price = offer.original_price - discountAmount;

            return NextResponse.json({ success: true, message: 'Offer fetched', data: offer });
        }

        const res = await dbQuery(`
            SELECT c.*, p.name, p.description, p.price as original_price, p.image, p.duration_days, p.features, p.slug as package_slug
            FROM coupons c
            JOIN packages p ON c.package_id = p.package_id
            WHERE c.status = 'active'
            ORDER BY c.created_at DESC
        `, []);

        const offers = res.rows.map(offer => {
            const discountAmount = offer.is_percentage ? (offer.original_price * offer.discount / 100) : offer.discount;
            return {
                ...offer,
                price: offer.original_price - discountAmount
            };
        });

        return NextResponse.json({ success: true, message: 'Offers fetched', data: offers });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const { title, description, price, features } = await req.json();

        if (!title || !description || price === undefined) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const slug = generateSlug(title);
        const existing = await dbQuery("SELECT package_id FROM packages WHERE slug = $1", [slug]);
        if (existing.rows.length > 0) return NextResponse.json({ success: false, message: "Offer slug already exists" }, { status: 400 });

        const parsedFeatures = features || [];

        const res = await dbQuery(`
            INSERT INTO packages (name, slug, description, price, duration_days, features, image, image_id)
            VALUES ($1, $2, $3, $4, 30, $5, '', '')
            RETURNING *
        `, [title, slug, description, Number(price), parsedFeatures]);

        return NextResponse.json({ success: true, message: 'Offer created successfully', data: res.rows[0] }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const body = await req.json();
        const { id, title, description, price, features } = body;

        if (!id) return NextResponse.json({ success: false, message: "Offer ID required" }, { status: 400 });

        const pkgRes = await dbQuery("SELECT * FROM packages WHERE package_id = $1", [id]);
        if (pkgRes.rows.length === 0) return NextResponse.json({ success: false, message: "Offer not found" }, { status: 404 });

        const updateFields = [];
        const updateParams = [];

        if (title) {
            updateParams.push(title);
            updateFields.push(`name = $${updateParams.length}`);
            updateParams.push(generateSlug(title));
            updateFields.push(`slug = $${updateParams.length}`);
        }
        if (description) {
            updateParams.push(description);
            updateFields.push(`description = $${updateParams.length}`);
        }
        if (price !== undefined) {
            updateParams.push(Number(price));
            updateFields.push(`price = $${updateParams.length}`);
        }
        if (features) {
            updateParams.push(features);
            updateFields.push(`features = $${updateParams.length}`);
        }

        if (updateFields.length > 0) {
            updateParams.push(id);
            const sql = `UPDATE packages SET ${updateFields.join(', ')}, updated_at = NOW() WHERE package_id = $${updateParams.length} RETURNING *`;
            const updatedRes = await dbQuery(sql, updateParams);
            return NextResponse.json({ success: true, message: 'Offer updated successfully', data: updatedRes.rows[0] });
        }

        return NextResponse.json({ success: true, message: 'Offer updated successfully', data: pkgRes.rows[0] });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const { id } = await req.json();
        const res = await dbQuery("DELETE FROM packages WHERE package_id = $1 RETURNING *", [id]);
        
        if (res.rows.length === 0) return NextResponse.json({ success: false, message: "Offer not found" }, { status: 404 });

        return NextResponse.json({ success: true, message: 'Offer deleted successfully' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}