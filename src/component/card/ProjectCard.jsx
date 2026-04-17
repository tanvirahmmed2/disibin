import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ProjectCard = ({ project }) => {
    return (
        <Link href={`/projects/${project.slug}`} className='group w-full shadow flex flex-col bg-white overflow-hidden rounded-xl border border-slate-100 hover:border-emerald-500/10 transition-all duration-500'>
            <div className='w-full aspect-16/10 relative overflow-hidden bg-slate-50 '>
                <Image 
                    src={project.image} 
                    alt={project.title} 
                    fill 
                    className='object-cover group-hover:scale-105 transition-all duration-1000'
                />
                <div className='absolute bottom-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-sm text-[10px] font-black text-slate-900 uppercase tracking-widest'>
                    View Case Study
                </div>
            </div>
            
            <div className='p-4 flex flex-col flex-1 space-y-6 w-full bg-slate-100'>
                <div className='space-y-3'>
                    <h3 className='text-2xl font-semibold text-slate-900 tracking-tighter leading-tight group-hover:text-emerald-500 transition-colors'>
                        {project.title}
                    </h3>
                    <p className='text-slate-500 text-sm font-medium leading-relaxed line-clamp-3'>
                        {project.description}
                    </p>
                </div>
                
            </div>
        </Link>
    )
}


export default ProjectCard
