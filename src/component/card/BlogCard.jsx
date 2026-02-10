import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const BlogCard = ({ blog }) => {
    return (
        <Link href={`/blogs/${blog.slug}`} className='w-full flex flex-col items-center justify-center gap-1 p-2 shadow hover:shadow-xl transform ease-in-out duration-300 rounded-2xl overflow-hidden relative'>
            <div className='w-full h-70 overflow-hidden'>
                <Image src={blog.image} alt='blog cover' width={1000} height={1000} className='w-full h-70 object-cover rounded-xl' />
            </div>
            <div className='w-full flex flex-col gap-1'>
                <strong>{blog.title}</strong>
                <p>{blog.description.slice(0, 70)}...</p>
                <div className='w-full flex flex-wrap gap-1'>
                    {
                        blog.tags.map((e) => (
                            <p key={e} className='w-auto px-3 bg-emerald-50 rounded-2xl'>{e}</p>
                        ))
                    }
                </div>
            </div>
        </Link>
    )
}

export default BlogCard
