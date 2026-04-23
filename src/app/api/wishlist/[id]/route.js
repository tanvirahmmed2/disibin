import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isLogin } from "@/lib/middleware";

export async function DELETE(req, { params }) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        
        const { id } = await params;

        const res = await dbQuery("DELETE FROM wishlists WHERE wishlist_id = $1 AND user_id = $2 RETURNING *", [id, auth.data.id]);
        
        if (res.rows.length === 0) return NextResponse.json({ success: false, message: "Item not found" }, { status: 404 });

        return NextResponse.json({ success: true, message: "Item removed from wishlist" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
