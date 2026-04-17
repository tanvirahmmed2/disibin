import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import { Project } from "@/lib/models/project";
import cloudinary from "@/lib/database/cloudinary";
import { isLogin, isManager, isProjectManager } from "@/lib/middleware";
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
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const user = auth.data;
        let query = {};

        
        if (user.role === 'client') {
            query.clientId = user._id;
        }

        const projects = await Project.find(query).populate('clientId', 'name email').sort({ createdAt: -1 });
        return NextResponse.json({
            success: true,
            message: 'Projects fetched successfully',
            data: projects
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectDB();
        const auth = await isProjectManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const formData = await req.formData();
        const title = formData.get('title');
        const description = formData.get('description');
        const category = formData.get('category');
        const clientId = formData.get('clientId');
        const imageFile = formData.get('image');

        if (!title || !description || !category || !imageFile) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        const slug = generateSlug(title);
        const existing = await Project.findOne({ slug });
        if (existing) return NextResponse.json({ success: false, message: 'Slug already exists' }, { status: 400 });

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
            clientId: clientId || null,
            image: cloudImage.secure_url,
            imageId: cloudImage.public_id,
            status: 'pending'
        });

        
        await createLog({
            userId: auth.data._id,
            action: 'create',
            targetType: 'project',
            targetId: project._id,
            description: `Created new project: ${project.title}`,
            metadata: { category: project.category, clientId: project.clientId }
        });

        return NextResponse.json({ success: true, message: 'Project created', data: project });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        await connectDB();
        const auth = await isProjectManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const formData = await req.formData();
        const id = formData.get('id');
        const title = formData.get('title');
        const description = formData.get('description');
        const status = formData.get('status');
        const imageFile = formData.get('image');

        const project = await Project.findById(id);
        if (!project) return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 });

        const updateData = {};
        if (title) {
            updateData.title = title;
            updateData.slug = generateSlug(title);
        }
        if (description) updateData.description = description;
        if (status) updateData.status = status;

        if (imageFile && typeof imageFile !== 'string') {
            if (project.imageId) {
                await cloudinary.uploader.destroy(project.imageId);
            }
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
            description: `Updated project: ${updated.title} (Status: ${updated.status})`,
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
        const auth = await isManager();
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
