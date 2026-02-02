import cloudinary from "@/lib/database/cloudinary";
import ConnectDB from "@/lib/database/mongo";
import Project from "@/lib/models/project";
import { NextResponse } from "next/server";
import slugify from "slugify";


export async function GET() {
    try {
        await ConnectDB()

        const projects = await Project.find({}).sort({ createdAt: -1 }).lean()

        if (!projects || projects.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'No project data found'
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: 'Project data fetched successfully',
            payload: projects
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch data',
            error: error.message
        }, { status: 500 })

    }

}


export async function POST(req) {
    try {
        await ConnectDB()

        const formData = await req.formData();
        const title = formData.get("title");
        const description = formData.get('description');
        const tags = formData.get('tags');
        const category = formData.get('category');
        const siteLink = formData.get('siteLink');
        const repository = formData.get('repository');
        const skills = formData.get('skills');
        const imageFile = formData.get('image');
        const image2File = formData.get('image2');

        if (!title || !description || !tags || !category || !siteLink || !repository || !skills) {
            return NextResponse.json({ success: false, message: "Please fill all text inputs" }, { status: 400 })
        }

        if (!imageFile || !image2File) {
            return NextResponse.json({
                success: false,
                message: "Both images are required"
            }, { status: 400 })
        }

        const slug = slugify(title, { strict: true, lower: true })
        const existProject = await Project.findOne({ slug })
        if (existProject) {
            return NextResponse.json({ success: false, message: "Please use another title" }, { status: 400 })
        }

        const tagsArr = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        const descriptionArr = description.split('||').map(desc => desc.trim()).filter(desc => desc.length > 0);
        const skillsArr = skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0)

        const uploadToCloudinary = async (file) => {
            const buffer = Buffer.from(await file.arrayBuffer());
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "tanvir" },
                    (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    }
                );
                stream.end(buffer);
            });
        };

        const [cloudImage1, cloudImage2] = await Promise.all([
            uploadToCloudinary(imageFile),
            uploadToCloudinary(image2File)
        ]);

        const newProject = new Project({
            title,
            description: descriptionArr,
            slug,
            category,
            repository,
            siteLink,
            image: cloudImage1.secure_url,
            imageId: cloudImage1.public_id,
            image2: cloudImage2.secure_url,
            imageId2: cloudImage2.public_id,
            tags: tagsArr,
            skills: skillsArr
        })

        await newProject.save()

        return NextResponse.json({
            success: true,
            message: 'Successfully submitted project'
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Failed to add project",
            error: error.message
        }, { status: 500 })
    }
}



export async function DELETE(req) {
    try {
        await ConnectDB()

        const { id } = await req.json()
        if (!id) {
            return NextResponse.json({
                success: false,
                message: 'Id not found'
            }, { status: 400 })
        }

        const project = await Project.findById(id)
        if (!project) {
            return NextResponse.json({
                success: false,
                message: 'Project not found'
            }, { status: 400 })
        }

        await cloudinary.uploader.destroy(project.imageId)

        await Project.findByIdAndDelete(id)

        return NextResponse.json({
            success: true,
            message: 'Successfully deleted product'
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to delete product',
            error: error.message
        }, { status: 500 })

    }

}