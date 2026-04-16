import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ProjectCard = ({ project }) => {
    return (
        <Link href={`/projects/${project.slug}`} className='card-premium flex flex-col group overflow-hidden bg-white relative'>
            <div className='absolute top-4 right-4 z-30 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm text-xs font-bold text-emerald-700 tracking-wider uppercase'>
                Contact For Price
            </div>
            
            <div className='w-full aspect-video relative overflow-hidden'>
                <div className="absolute inset-0 bg-emerald-600/10 mix-blend-multiply z-10 group-hover:bg-transparent transition-all duration-500"></div>
                <Image 
                    src={project.image} 
                    alt={project.title} 
                    fill 
                    className='object-cover transform group-hover:scale-110 transition-transform duration-700'
                />
            </div>
            
            <div className='flex flex-col p-6 z-20 flex-1 relative'>
                <h3 className='text-xl font-bold bg-white text-slate-800 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2'>
                    {project.title}
                </h3>
                <p className='text-slate-500 text-sm mb-6 flex-1 line-clamp-3 leading-relaxed'>
                    {project.description}
                </p>
                
                <div className='flex flex-wrap gap-2 pt-4 border-t border-slate-100'>
                    {project.tags?.slice(0, 3).map((e) => (
                        <span key={e} className='px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-bold rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors uppercase tracking-wider'>
                            {e}
                        </span>
                    ))}
                    {project.tags?.length > 3 && (
                        <span className='px-3 py-1 bg-slate-50 text-slate-400 text-xs font-bold rounded-lg'>
                            +{project.tags.length - 3}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    )
}

export default ProjectCard
