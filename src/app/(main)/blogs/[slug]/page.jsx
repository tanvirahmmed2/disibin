import { BASE_URL } from '@/lib/database/secret'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const blog = async ({ params }) => {
    const { slug } = await params
    const res = await fetch(`${BASE_URL}/api/blog/${slug}`, {
        method: 'GET',
        cache: 'no-store'
    })

    const data = await res.json()
    if (!data.success) return <div className='w-full flex items-center justify-center'>
        <p>No Data Found!</p>
    </div>
    const blog = data.data
    return (
        <div className='w-full max-w-4xl mx-auto flex flex-col items-center gap-4 p-4 min-h-screen'>
            <div className='w-full overflow-hidden relative'>

                <Image src={blog?.image} alt='blog cover' width={1000} height={1000} className='w-full aspect-video  border border-black/30 shadow object-cover rounded-xl' />
            </div>
            <h1 className='text-2xl font-semibold'>{blog.title}</h1>
            <p className='w-full text-slate-600 leading-relaxed'>{blog.description}</p>
            
        </div>
    )
}

export default blog
