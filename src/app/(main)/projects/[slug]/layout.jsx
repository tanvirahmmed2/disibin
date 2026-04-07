import { BASE_URL } from '@/lib/database/secret'
import React from 'react'

export async function generateMetadata({ params }) {
    const { slug } = await params
    
    const res = await fetch(`${BASE_URL}/api/project/${slug}`)
    
    if (!res.ok) return { title: 'Project Not Found' }
    
    const data = await res.json()
    const project = data.payload

    return {
        title: project.title,
        description: project.description,
    };
}

const ProjectLayout = ({ children }) => {
    return (
        <div className='w-full'>
            {children}
        </div>
    )
}

export default ProjectLayout
