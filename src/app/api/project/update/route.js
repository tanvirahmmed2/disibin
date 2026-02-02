import ConnectDB from "@/lib/database/mongo"
import Project from "@/lib/models/project"
import { NextResponse } from "next/server"
import slugify from "slugify"

export async function POST(req) {
    try {
        await ConnectDB()

        const { id, title, description, category, repository, siteLink, tags, skills } = await req.json()

        if (!title || !description || !id) {
            return NextResponse.json({
                success: false,
                message: 'Please fill all data'
            }, { status: 400 })
        }

        const newSlug = slugify(title, { strict: true, lower: true })
        const tagsArr = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        const descriptionArr = description.split('||').map(desc => desc.trim()).filter(desc => desc.length > 0);
        const skillsArr = skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0)



        const updatedProject = await Project.findByIdAndUpdate(
            id,
            {
                title, description:descriptionArr, slug:newSlug, category, repository, siteLink, tags: tagsArr, skills: skillsArr
            },
            { new: true }
        )

        if (!updatedProject) {
            return NextResponse.json({
                success: false,
                message: 'Project not found, invalid id'
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: 'Successfully updated data',
            payload: updatedProject
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to update project',
            error: error.message,
        }, { status: 500 })
    }
}