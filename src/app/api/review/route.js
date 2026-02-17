
import cloudinary from "@/lib/database/cloudinary";
import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const query = "SELECT * FROM public.reviews ORDER BY created_at DESC";
        const result = await pool.query(query);

        return NextResponse.json({
            success: true,
            message: 'Sucessfully fetched data',
            payload: result.rows
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const data = await req.formData();
        const name = data.get('name');
        const email = data.get('email');
        const company = data.get('company_name');
        const rating = data.get('rating');
        const comment = data.get('comment');
        const imageFile = data.get('image');

        if (!name || !email || !rating || !comment || !imageFile) {
            return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
        }
        const existReview = await pool.query(`SELECT * FROM reviews WHERE user_email=$1`, [email])
        if (existReview.rowCount !== 0) {
            return NextResponse.json({
                success: false, message: 'Already has been reviewed'
            }, { status: 400 })
        }
        const buffer = Buffer.from(await imageFile.arrayBuffer());

        const cloudImage = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "reviews" },
                (err, result) => { if (err) reject(err); else resolve(result); }
            );
            stream.end(buffer);
        });

        const query = `
            INSERT INTO public.reviews (user_name, user_email, user_image, user_image_id, company_name, rating, comment)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;

        const values = [
            name,
            email,
            cloudImage.secure_url,
            cloudImage.public_id,
            company,
            Number(rating),
            comment
        ];

        const result = await pool.query(query, values);

        return NextResponse.json({
            success: true,
            message: "Review submitted for approval",
            payload: result.rows[0]
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const { id } = await req.json();

        if (!id) return NextResponse.json({ success: false, message: "Review ID required" }, { status: 400 });

        const query = `
            UPDATE public.reviews 
            SET is_approved = NOT is_approved, updated_at = CURRENT_TIMESTAMP 
            WHERE review_id = $1 
            RETURNING *;
        `;

        const result = await pool.query(query, [id]);

        if (result.rowCount === 0) {
            return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 });
        }

        const updatedReview = result.rows[0];

        return NextResponse.json({
            success: true,
            message: updatedReview.is_approved ? "Review approved" : "Review hidden",
            payload: updatedReview
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { id } = await req.json();

        const findQuery = "SELECT user_image_id FROM public.reviews WHERE review_id = $1";
        const findResult = await pool.query(findQuery, [id]);

        if (findResult.rowCount === 0) {
            return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 });
        }

        const imageId = findResult.rows[0].user_image_id;
        if (imageId) {
            await cloudinary.uploader.destroy(imageId);
        }

        await pool.query("DELETE FROM public.reviews WHERE review_id = $1", [id]);

        return NextResponse.json({
            success: true,
            message: "Review and associated image deleted"
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}