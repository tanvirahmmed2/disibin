import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isLogin } from "@/lib/middleware";

// GET /api/website/[id] — fetch a specific website
export async function GET(req, { params }) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        const user = auth.data;

        const { id } = await params;

        const res = await dbQuery(`
            SELECT w.* 
            FROM websites w
            JOIN tenant_users tu ON w.tenant_id = tu.tenant_id
            WHERE w.website_id = $1 AND tu.user_id = $2
        `, [id, user.id]);
        
        if (res.rows.length === 0) return NextResponse.json({ success: false, message: "Website not found or access denied" }, { status: 404 });
        return NextResponse.json({ success: true, data: res.rows[0] });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PATCH /api/website/[id] — update a website's branding and content
export async function PATCH(req, { params }) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        const user = auth.data;

        const { id } = await params;
        const body = await req.json();

        // 1. Fetch website and check ownership
        const webRes = await dbQuery("SELECT * FROM websites WHERE website_id = $1", [id]);
        if (webRes.rows.length === 0) return NextResponse.json({ success: false, message: "Website not found" }, { status: 404 });
        const website = webRes.rows[0];

        // Authorization check: ONLY Owner of the tenant
        const ownerRes = await dbQuery(
            "SELECT id FROM tenant_users WHERE tenant_id = $1 AND user_id = $2 AND role = 'owner'",
            [website.tenant_id, user.id]
        );
        if (ownerRes.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Unauthorized: Only the tenant owner can update website details" }, { status: 403 });
        }

        const { 
            name, theme, 
            business_name, logo, favicon, 
            email, phone, address, city, country,
            meta_title, meta_description,
            facebook, instagram, linkedin, youtube,
            primary_color, secondary_color,
            is_public, is_store_enabled
        } = body;

        const updateFields = [];
        const updateParams = [];

        const addField = (val, field) => {
            if (val !== undefined) {
                updateParams.push(val);
                updateFields.push(`${field} = $${updateParams.length}`);
            }
        };

        addField(name, 'name');
        addField(theme, 'theme');
        addField(business_name, 'business_name');
        addField(logo, 'logo');
        addField(favicon, 'favicon');
        addField(email, 'email');
        addField(phone, 'phone');
        addField(address, 'address');
        addField(city, 'city');
        addField(country, 'country');
        addField(meta_title, 'meta_title');
        addField(meta_description, 'meta_description');
        addField(facebook, 'facebook');
        addField(instagram, 'instagram');
        addField(linkedin, 'linkedin');
        addField(youtube, 'youtube');
        addField(primary_color, 'primary_color');
        addField(secondary_color, 'secondary_color');
        addField(is_public, 'is_public');
        addField(is_store_enabled, 'is_store_enabled');

        if (updateFields.length === 0) {
            return NextResponse.json({ success: false, message: "No fields to update" }, { status: 400 });
        }

        updateParams.push(id);
        const res = await dbQuery(`
            UPDATE websites 
            SET ${updateFields.join(', ')}, updated_at = NOW()
            WHERE website_id = $${updateParams.length}
            RETURNING *
        `, updateParams);

        return NextResponse.json({ success: true, message: 'Website updated successfully', data: res.rows[0] });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
