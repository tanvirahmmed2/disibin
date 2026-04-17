import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ProjectCard = ({ project }) => {
    return (
        <Link href={`/projects/${project.slug}`} className='group flex flex-col bg-white overflow-hidden rounded-[2.5rem] border border-slate-100 hover:border-primary/10 transition-all duration-500'>
            <div className='w-full aspect-[16/10] relative overflow-hidden bg-slate-50'>
                <Image 
                    src={project.image} 
                    alt={project.title} 
                    fill 
                    className='object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000'
                />
                <div className='absolute bottom-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-sm text-[10px] font-black text-slate-900 uppercase tracking-widest'>
                    View Case Study
                </div>
            </div>
            
            <div className='p-10 flex flex-col flex-1 space-y-6'>
                <div className='space-y-3'>
                    <h3 className='text-3xl font-black text-slate-900 tracking-tighter leading-tight group-hover:text-primary transition-colors'>
                        {project.title}
                    </h3>
                    <p className='text-slate-500 text-sm font-medium leading-relaxed line-clamp-3'>
                        {project.description}
                    </p>
                </div>
                
                <div className='flex flex-wrap gap-3 pt-6 border-t border-slate-50'>
                    {project.tags?.slice(0, 3).map((e) => (
                        <span key={e} className='px-4 py-2 bg-slate-50 text-slate-400 text-[9px] font-black rounded-xl uppercase tracking-widest group-hover:bg-primary/5 group-hover:text-primary transition-colors'>
                            {e}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    )
}


export default ProjectCard
