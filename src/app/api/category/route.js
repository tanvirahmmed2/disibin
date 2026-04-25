import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isManager } from "@/lib/middleware";
import { createLog } from "@/lib/utils/logger";

export async function GET() {
    try {
        const res = await dbQuery("SELECT * FROM categories ORDER BY name ASC", []);
        return NextResponse.json({
            success: true,
            message: 'Categories fetched successfully',
            data: res.rows
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const { name } = await req.json();
        if (!name) return NextResponse.json({ success: false, message: "Category name is required" }, { status: 400 });

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        const res = await dbQuery(
            "INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING *",
            [name, slug]
        );

        const category = res.rows[0];

        await createLog({
            userId: auth.data.id,
            action: 'create',
            targetType: 'category',
            targetId: category.category_id,
            description: `Created category: ${category.name}`
        });

        return NextResponse.json({
            success: true,
            message: 'Category created successfully',
            data: category
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
export async function PATCH(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const { id, name } = await req.json();
        if (!id || !name) return NextResponse.json({ success: false, message: "ID and Name are required" }, { status: 400 });

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        const res = await dbQuery(
            "UPDATE categories SET name = $1, slug = $2 WHERE category_id = $3 RETURNING *",
            [name, slug, id]
        );

        if (res.rows.length === 0) return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });

        const updatedCategory = res.rows[0];

        await createLog({
            userId: auth.data.id,
            action: 'update',
            targetType: 'category',
            targetId: updatedCategory.category_id,
            description: `Updated category: ${updatedCategory.name}`
        });

        return NextResponse.json({
            success: true,
            message: 'Category updated successfully',
            data: updatedCategory
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const { id } = await req.json();
        if (!id) return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });

        const res = await dbQuery("DELETE FROM categories WHERE category_id = $1 RETURNING *", [id]);
        
        if (res.rows.length === 0) return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });

        const deletedCategory = res.rows[0];

        await createLog({
            userId: auth.data.id,
            action: 'delete',
            targetType: 'category',
            targetId: deletedCategory.category_id,
            description: `Deleted category: ${deletedCategory.name}`
        });

        return NextResponse.json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
