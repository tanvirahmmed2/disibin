import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isManager } from "@/lib/middleware";

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

        return NextResponse.json({
            success: true,
            message: 'Category created successfully',
            data: res.rows[0]
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
