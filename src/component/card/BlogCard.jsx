import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const BlogCard = ({ blog }) => {
    return (
        <Link href={`/blogs/${blog.slug}`} className='group w-full flex flex-col shadow bg-white overflow-hidden rounded-xl border border-slate-100 hover:border-primary/10 transition-all duration-500'>
            <div className='w-full aspect-16/10 relative overflow-hidden bg-slate-50 border-b border-slate-50'>
                <Image 
                    src={blog.image} 
                    alt={blog.title} 
                    fill 
                    className='object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000' 
                />
            </div>
            <div className='p-4 w-full flex flex-col flex-1 space-y-6'>
                <div className='space-y-3'>
                    <div className='flex items-center gap-2'>
                        <span className='w-1 h-1 rounded-full bg-primary/50' />
                        <span className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-400'>Insight</span>
                    </div>
                    <h3 className='text-3xl font-black text-slate-900 tracking-tighter leading-[1.1] group-hover:text-primary transition-colors line-clamp-2'>
                        {blog.title}
                    </h3>
                    <p className='text-slate-500 text-sm font-medium leading-relaxed line-clamp-3'>
                        {blog.description}
                    </p>
                </div>
                
                <div className='flex items-center justify-between pt-6 border-t border-slate-50'>
                    <div className='flex gap-2 font-black text-[9px] uppercase tracking-widest text-slate-400'>
                        {new Date(blog.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </div>
                    <span className='text-slate-900 font-black text-[9px] uppercase tracking-widest group-hover:text-primary transition-colors'>
                        Read Full →
                    </span>
                </div>
            </div>
        </Link>
    )
}


export default BlogCard
