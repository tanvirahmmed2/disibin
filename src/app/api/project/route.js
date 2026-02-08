import cloudinary from "@/lib/database/cloudinary";
import ConnectDB from "@/lib/database/mongo";
import Project from "@/lib/models/project";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function GET() {
    try {
        await ConnectDB();
        const projects = await Project.find({}).sort({ createdAt: -1 }).lean();

        return NextResponse.json({
            success: true,
            message: 'Project data fetched successfully',
            payload: projects
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to fetch data', error: error.message }, { status: 500 });
    }
}



export async function POST(req) {
    try {
        await ConnectDB();

        const formData = await req.formData();

        const title = formData.get("title");
        const description = formData.get('description');
        const tags = formData.get('tags');
        const category = formData.get('category');
        const preview = formData.get('preview');
        const skills = formData.get('skills');
        const price = formData.get('price'); 
        const imageFile = formData.get('image');

        
        if (!title || !description || !category || !preview || !imageFile) {
            return NextResponse.json({ success: false, message: "Required fields missing" }, { status: 400 });
        }

        const slug = slugify(title, { strict: true, lower: true });
        
        const existProject = await Project.findOne({ slug });
        if (existProject) {
            return NextResponse.json({ success: false, message: "Please use another title" }, { status: 400 });
        }

        
        const tagsArr = tags ? tags.split(',').map(t => t.trim()).filter(t => t) : [];
        const skillsArr = skills ? skills.split(',').map(s => s.trim()).filter(s => s) : [];

        
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const cloudImage = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "disibin" },
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            );
            stream.end(buffer);
        });

        const newProject = new Project({
            title,
            description,
            slug,
            category,
            price: price || 0,
            preview,
            image: cloudImage.secure_url,
            imageId: cloudImage.public_id,
            tags: tagsArr,
            skills: skillsArr
        });

        await newProject.save();

        return NextResponse.json({ success: true, message: 'Successfully submitted project' });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Failed to add project", error: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        await ConnectDB();
        const { id } = await req.json();

        const project = await Project.findById(id);
        if (!project) {
            return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 });
        }

        await cloudinary.uploader.destroy(project.imageId);
        await Project.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: 'Successfully deleted product' });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to delete product', error: error.message }, { status: 500 });
    }
}