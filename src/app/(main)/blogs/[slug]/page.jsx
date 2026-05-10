import { getBlogBySlug } from '@/lib/data/blogs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const blog = async ({ params }) => {
    const { slug } = await params
    let blogData = null
    try {
        blogData = await getBlogBySlug(slug)
    } catch (error) {
        console.error('Blog data error:', error)
    }

    if (!blogData) return <div className='w-full flex items-center justify-center'>
        <p>No Data Found!</p>
    </div>

    return (
        <div className='w-full max-w-4xl mx-auto flex flex-col items-center gap-4 p-4 min-h-screen'>
            <div className='w-full overflow-hidden relative'>
                <Image src={blogData?.image} alt='blog cover' width={1000} height={1000} className='w-full aspect-video border border-black/30 shadow object-cover rounded-xl' />
            </div>
            <h1 className='text-2xl font-semibold'>{blogData.title}</h1>
            <p className='w-full text-slate-600 leading-relaxed'>{blogData.description}</p>
        </div>
    )
}

export default blog
