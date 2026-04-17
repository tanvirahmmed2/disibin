import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import { Project } from "@/lib/models/project";
import cloudinary from "@/lib/database/cloudinary";
import { isEditor } from "@/lib/middleware";
import { createLog } from "@/lib/utils/logger";

const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
};

export async function GET(req) {
    try {
        await connectDB();
        const projects = await Project.find({}).sort({ createdAt: -1 });
        return NextResponse.json({
            success: true,
            message: 'Projects fetched successfully',
            payload: projects
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectDB();
        const auth = await isEditor();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const formData = await req.formData();
        const title = formData.get('title');
        const description = formData.get('description');
        const category = formData.get('category');
        const preview = formData.get('preview'); 
        const imageFile = formData.get('image');

        if (!title || !description || !category || !preview || !imageFile) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        const slug = generateSlug(title);
        const existing = await Project.findOne({ slug });
        if (existing) return NextResponse.json({ success: false, message: 'Project title/slug already exists' }, { status: 400 });

        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const cloudImage = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "projects" },
                (err, result) => { if (err) reject(err); else resolve(result); }
            );
            stream.end(buffer);
        });

        const project = await Project.create({
            title,
            slug,
            description,
            category,
            preview,
            image: cloudImage.secure_url,
            imageId: cloudImage.public_id
        });

        await createLog({
            userId: auth.data._id,
            action: 'create',
            targetType: 'project',
            targetId: project._id,
            description: `Created new project: ${project.title}`,
            metadata: { category: project.category }
        });

        return NextResponse.json({ success: true, message: 'Project created', data: project });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        await connectDB();
        const auth = await isEditor();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const formData = await req.formData();
        const id = formData.get('id');
        
        if (!id) return NextResponse.json({ success: false, message: 'Project ID is required' }, { status: 400 });

        const project = await Project.findById(id);
        if (!project) return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 });

        const updateData = {};
        const fields = ['title', 'description', 'category', 'preview'];
        
        fields.forEach(field => {
            const value = formData.get(field);
            if (value) updateData[field] = value;
        });

        if (updateData.title) {
            updateData.slug = generateSlug(updateData.title);
        }

        const imageFile = formData.get('image');
        if (imageFile && typeof imageFile !== 'string') {
            // Delete old image
            if (project.imageId) {
                await cloudinary.uploader.destroy(project.imageId);
            }
            // Upload new image
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const cloudImage = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "projects" },
                    (err, result) => { if (err) reject(err); else resolve(result); }
                );
                stream.end(buffer);
            });
            updateData.image = cloudImage.secure_url;
            updateData.imageId = cloudImage.public_id;
        }

        const updated = await Project.findByIdAndUpdate(id, updateData, { new: true });

        await createLog({
            userId: auth.data._id,
            action: 'update',
            targetType: 'project',
            targetId: updated._id,
            description: `Updated project: ${updated.title}`,
            metadata: { updatedFields: Object.keys(updateData) }
        });

        return NextResponse.json({ success: true, message: 'Project updated', data: updated });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        await connectDB();
        const auth = await isEditor();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const { id } = await req.json();
        const project = await Project.findById(id);
        if (!project) return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 });

        if (project.imageId) {
            await cloudinary.uploader.destroy(project.imageId);
        }

        await Project.findByIdAndDelete(id);

        await createLog({
            userId: auth.data._id,
            action: 'delete',
            targetType: 'project',
            targetId: id,
            description: `Deleted project: ${project.title}`
        });

        return NextResponse.json({ success: true, message: 'Project deleted' });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}