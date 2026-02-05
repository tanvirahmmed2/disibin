import ConnectDB from "@/lib/database/mongo"
import Project from "@/lib/models/project"
import { NextResponse } from "next/server"
import slugify from "slugify"

export async function POST(req) {
    try {
        await ConnectDB()

        const { id, title, description, category, preview, tags, skills, price, isFeatured } = await req.json()

        
        if (!id || !title || !description) {
            return NextResponse.json({
                success: false,
                message: 'ID, title, and description are required'
            }, { status: 400 })
        }

        const newSlug = slugify(title, { strict: true, lower: true })
        
        
        const tagsArr = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [];
        const skillsArr = skills ? skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0) : [];

        
     
        const updatedProject = await Project.findByIdAndUpdate(
            id,
            {
                title, 
                description, 
                slug: newSlug, 
                category, 
                preview, 
                tags: tagsArr, 
                skills: skillsArr,
                price,
                isFeatured
            },
            { new: true, runValidators: true }
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