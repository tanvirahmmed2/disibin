import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ProjectCard = ({ project }) => {
    return (
        <Link href={`/projects/${project.slug}`} className='group w-full flex flex-col bg-white rounded-2xl border border-slate-100 hover:border-emerald-500/10 transition-all duration-300 hover:shadow-md'>
            <div className='w-full aspect-[16/10] relative overflow-hidden rounded-t-2xl'>
                <Image 
                    src={project.image} 
                    alt={project.title} 
                    fill 
                    className='object-cover group-hover:scale-105 transition-all duration-700'
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className='absolute bottom-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl shadow-sm text-[9px] font-semibold text-slate-900 uppercase tracking-widest border border-white/20 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500'>
                    Explore Project
                </div>
            </div>
            
            <div className='p-8 flex flex-col flex-1'>
                <div className='flex flex-col gap-3'>
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-[0.2em]">{project.category_name || 'Case Study'}</span>
                    </div>
                    <h3 className='text-2xl font-bold text-slate-900 tracking-tight group-hover:text-emerald-600 transition-colors'>
                        {project.title}
                    </h3>
                    <p className='text-slate-500 text-xs font-medium leading-relaxed line-clamp-2'>
                        {project.description}
                    </p>
                </div>
            </div>
        </Link>
    )
}


export default ProjectCard
