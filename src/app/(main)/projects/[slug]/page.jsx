import { BASE_URL } from '@/lib/database/secret'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Project = async ({ params }) => {
    const { slug } = await params
    const res = await fetch(`${BASE_URL}/api/project/${slug}`, {
        method: 'GET',
        cache: 'no-store'
    })

    const data = await res.json()
    if (!data.success) return <div className='w-full flex items-center justify-center'>
        <p>No Data Found!</p>
    </div>
    const project = data.data
    return (
        <div className='w-full max-w-4xl mx-auto flex flex-col items-center gap-4 p-4 min-h-screen'>
            <div className='w-full overflow-hidden relative'>
                <Image src={project.image} alt='project cover' width={1000} height={1000} className='w-full aspect-video object-cover border border-black/30 shadow rounded-xl' />
            </div>
            <h1 className='text-2xl font-semibold'>{project.title}</h1>
            <p className="text-emerald-600 font-bold uppercase tracking-widest text-xs">{project.category_name}</p>
            <p className='w-full text-slate-600 leading-relaxed'>{project.description}</p>
            
            {project.live_url && (
                <Link href={project.live_url} target="_blank" className='w-full bg-slate-900 text-white p-3 text-center rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-emerald-500 transition-all'>
                    Live Preview
                </Link>
            )}
        </div>
    )
}

export default Project
