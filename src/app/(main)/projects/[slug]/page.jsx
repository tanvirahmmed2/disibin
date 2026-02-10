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
    const project = data.payload
    return (
        <div className='w-full max-w-3xl mx-auto flex flex-col items-center gap-4 p-4 min-h-screen'>
            <div className='w-full overflow-hidden relative'>
                <p className='absolute top-6 right-6 bg-gray-50/50 px-4 rounded-2xl'>{project.price? `Worth  ৳${project.price}`:`Contact For Price`}</p>
                <Image src={project.image} alt='project cover' width={1000} height={1000} className='w-full  rounded-xl' />
            </div>
            <h1 className='text-2xl font-semibold'>{project.title}</h1>
            <p>{project.category}</p>
            <p className='w-full'><strong>Description:</strong> {project.description}</p>
            <div className='w-full flex flex-wrap gap-1'>
                {
                    project.tags.map((e) => (
                        <p key={e} className='w-auto px-3 bg-gray-50 rounded-2xl'>{e}</p>
                    ))
                }
            </div>
            <Link href={`${project.preview}`} className='w-full bg-emerald-600 text-white p-2 text-center rounded-lg'>Preview</Link>
            <div className='w-full flex flex-wrap gap-1'>
                {
                    project.skills.map((e) => (
                        <p key={e} className='w-auto px-3 bg-emerald-50 rounded-2xl'>{e}</p>
                    ))
                }
            </div>
        </div>
    )
}

export default Project
