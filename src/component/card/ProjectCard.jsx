import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ProjectCard = ({ project }) => {
    return (
        <Link href={`/projects/${project.slug}`} className='w-full flex flex-col group items-center justify-between gap-1 p-2 shadow-xl hover:shadow-2xl border border-teal-600 transform ease-in-out duration-300 rounded-sm overflow-hidden relative'>
            <p className='absolute top-6 right-6 bg-gray-50/50 px-4 rounded-2xl'>Contact For Price</p>
            <div className='w-full aspect-video overflow-hidden shadow border border-teal-600 rounded '>
                <Image src={project.image} alt='project cover' width={1000} height={1000} className='w-full aspect-video group-hover:scale-105 ease-in-out transform duration-500 object-cover rounded-sm shadow'/>
            </div>
            <div className='w-full flex flex-col gap-1'>
                <strong>{project.title}</strong>
                <p>{project.description.slice(0, 70)}...</p>
                <div className='w-full flex flex-wrap gap-1 text-xs'>
                    {
                        project.tags.map((e) => (
                            <p key={e} className='w-auto px-3 bg-emerald-500 text-white p-1 opacity-50 rounded-2xl'>{e}</p>
                        ))
                    }
                </div>
            </div>
        </Link>
    )
}

export default ProjectCard
