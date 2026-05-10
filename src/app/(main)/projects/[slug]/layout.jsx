import { BASE_URL } from '@/lib/database/secret'
import React from 'react'

export async function generateMetadata({ params }) {
    const { slug } = await params
    try {
        const res = await fetch(`${BASE_URL}/api/project/${slug}`)
        if (!res.ok) return { title: 'Project Not Found' }
        const data = await res.json()
        const project = data.data
        return {
            title: project.title,
            description: project.description,
        }
    } catch (error) {
        console.error('Project metadata fetch error:', error)
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
