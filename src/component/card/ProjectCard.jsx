import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ProjectCard = ({ project }) => {
    return (
        <Link href={`/projects/${project.slug}`} className='w-full flex flex-col items-center justify-center gap-1 p-2 shadow hover:shadow-xl transform ease-in-out duration-300 rounded-2xl overflow-hidden relative'>
            <p className='absolute top-6 right-6 bg-gray-50/50 px-4 rounded-2xl'>{project.price? `Worth  ৳${project.price}`:`Contact For Price`}</p>
            <div className='w-full h-70 overflow-hidden'>
                <Image src={project.image} alt='project cover' width={1000} height={1000} className='w-full h-70 object-cover rounded-xl'/>
            </div>
            <div className='w-full flex flex-col gap-1'>
                <strong>{project.title}</strong>
                <p>{project.description.slice(0, 70)}...</p>
                <div className='w-full flex flex-wrap gap-1'>
                    {
                        project.tags.map((e) => (
                            <p key={e} className='w-auto px-3 bg-emerald-50 rounded-2xl'>{e}</p>
                        ))
                    }
                </div>
            </div>
        </Link>
    )
}

export default ProjectCard
