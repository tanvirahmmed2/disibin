import cloudinary from "@/lib/database/cloudinary";
import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function GET() {
    try {
        const query = "SELECT * FROM public.projects ORDER BY created_at DESC";
        const result = await pool.query(query);

        return NextResponse.json({
            success: true,
            message: 'Project data fetched successfully',
            payload: result.rows || []
        });
    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            message: 'Failed to fetch data', 
            error: error.message 
        }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const formData = await req.formData();

        const title = formData.get("title");
        const description = formData.get('description');
        const tags = formData.get('tags');
        const category = formData.get('category');
        const preview = formData.get('preview');
        const skills = formData.get('skills');
        const imageFile = formData.get('image');

        if (!title || !description || !category || !preview || !imageFile) {
            return NextResponse.json({ success: false, message: "Required fields missing" }, { status: 400 });
        }

        const slug = slugify(title, { strict: true, lower: true });
        
        const checkExist = await pool.query("SELECT slug FROM public.projects WHERE slug = $1", [slug]);
        if (checkExist.rowCount > 0) {
            return NextResponse.json({ success: false, message: "Please use another title" }, { status: 400 });
        }

        const tagsArr = tags ? tags.split(',').map(t => t.trim()).filter(t => t) : [];
        const skillsArr = skills ? skills.split(',').map(s => s.trim()).filter(s => s) : [];

        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const cloudImage = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "projects" },
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            );
            stream.end(buffer);
        });

        const insertQuery = `
            INSERT INTO public.projects 
            (title, slug, description, category, preview, image, image_id, tags, skills)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *;
        `;

        const values = [
            title,
            slug,
            description,
            category,
            preview,
            cloudImage.secure_url,
            cloudImage.public_id,
            tagsArr,
            skillsArr
        ];

        const result = await pool.query(insertQuery, values);

        return NextResponse.json({ 
            success: true, 
            message: 'Successfully submitted project',
            payload: result.rows[0]
        });

    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            message: "Failed to add project", 
            error: error.message 
        }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ success: false, message: 'Project ID required' }, { status: 400 });
        }

        const findResult = await pool.query("SELECT image_id FROM public.projects WHERE project_id = $1", [id]);
        
        if (findResult.rowCount === 0) {
            return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 });
        }

        const imageId = findResult.rows[0].image_id;
        if (imageId) {
            await cloudinary.uploader.destroy(imageId);
        }

        await pool.query("DELETE FROM public.projects WHERE project_id = $1", [id]);

        return NextResponse.json({ success: true, message: 'Successfully deleted project' });
    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            message: 'Failed to delete project', 
            error: error.message 
        }, { status: 500 });
    }
}