import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const BlogCard = ({ blog }) => {
    return (
        <Link href={`/blogs/${blog.slug}`} className='card-premium flex flex-col group overflow-hidden bg-white'>
            <div className='w-full aspect-[16/9] relative overflow-hidden'>
                <div className="absolute inset-0 bg-emerald-600/10 mix-blend-multiply z-10 group-hover:bg-transparent transition-all duration-500"></div>
                <Image 
                    src={blog.image} 
                    alt={blog.title} 
                    fill 
                    className='object-cover transform group-hover:scale-110 transition-transform duration-700' 
                />
            </div>
            <div className='flex flex-col p-6 z-20 flex-1 relative'>
                <h3 className='text-xl font-bold bg-white text-slate-800 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2'>
                    {blog.title}
                </h3>
                <p className='text-slate-500 text-sm mb-6 flex-1 line-clamp-3 leading-relaxed'>
                    {blog.description}
                </p>
                
                <div className='flex flex-wrap gap-2 pt-4 border-t border-slate-100'>
                    {blog.tags?.slice(0, 3).map((e) => (
                        <span key={e} className='px-3 py-1 bg-slate-50 text-slate-500 text-xs font-bold rounded-lg group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors uppercase tracking-wider'>
                            {e}
                        </span>
                    ))}
                    {blog.tags?.length > 3 && (
                        <span className='px-3 py-1 bg-slate-50 text-slate-400 text-xs font-bold rounded-lg'>
                            +{blog.tags.length - 3}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    )
}

export default BlogCard
