import { NextResponse } from "next/server";
import { isManager } from "@/lib/middleware";
import { getProductBySlug, updateProduct, deleteProduct } from "@/lib/data/products";

// GET single product
export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const product = await getProductBySlug(id);
        
        if (!product) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: product });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PATCH update product (Manager only)
export async function PATCH(req, { params }) {
    try {
        const auth = await isManager();
        if (!auth.success) {
            return NextResponse.json(auth, { status: 403 });
        }

        const { id } = await params;
        const body = await req.json();

        const updatedProduct = await updateProduct(id, body);
        
        if (!updatedProduct) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE product (Manager only)
export async function DELETE(req, { params }) {
    try {
        const auth = await isManager();
        if (!auth.success) {
            return NextResponse.json(auth, { status: 403 });
        }

        const { id } = await params;
        const deletedProduct = await deleteProduct(id);

        if (!deletedProduct) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Product deleted successfully",
            data: deletedProduct
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
