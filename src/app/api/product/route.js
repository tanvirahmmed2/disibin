import { NextResponse } from "next/server";
import { isManager } from "@/lib/middleware";
import { createProduct, getAllProducts } from "@/lib/data/products";

// GET all products (Public)
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const includeInactive = searchParams.get('all') === 'true';
        
        // Only managers/admins can see inactive products if they ask
        let onlyActive = true;
        if (includeInactive) {
            const auth = await isManager();
            if (auth.success) onlyActive = false;
        }

        const products = await getAllProducts(onlyActive);
        return NextResponse.json({ success: true, data: products });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST create product (Manager only)
export async function POST(req) {
    try {
        const auth = await isManager();
        if (!auth.success) {
            return NextResponse.json(auth, { status: 403 });
        }

        const body = await req.json();
        const { name, slug, price } = body;

        if (!name || !slug || price === undefined) {
            return NextResponse.json({ success: false, message: "Missing required fields (name, slug, price)" }, { status: 400 });
        }

        const product = await createProduct({
            ...body,
            created_by: auth.data.id
        });

        return NextResponse.json({
            success: true,
            message: "Product created successfully",
            data: product
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
