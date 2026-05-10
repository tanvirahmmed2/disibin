import { getProjectBySlug } from '@/lib/data/projects'
import React from 'react'

export async function generateMetadata({ params }) {
    const { slug } = await params
    try {
        const project = await getProjectBySlug(slug)
        if (!project) return { title: 'Project Not Found' }
        return { title: project.title, description: project.description }
    } catch (error) {
        return { title: 'Project Not Found' }
    }
}

const ProjectLayout = ({ children }) => {
    return (
        <div className='w-full'>
            {children}
        </div>
    )
}

export default ProjectLayout
