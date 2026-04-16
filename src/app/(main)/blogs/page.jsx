import BlogCard from '@/component/card/BlogCard'
import { BASE_URL } from '@/lib/database/secret'
import React from 'react'

const blogsPage = async () => {
  const res = await fetch(`${BASE_URL}/api/blog`, {
    method: 'GET',
    cache: 'no-store'
  })

  const data = await res.json()

  if (!data.success) return (
    <div className='w-full min-h-[60vh] flex items-center justify-center bg-slate-50'>
      <div className="card-premium p-12 text-center text-slate-500 font-medium">
        Failed to load blogs.
      </div>
    </div>
  )
  const blogs = data.payload

  return (
    <div className='w-full min-h-screen bg-slate-50 py-20'>
      <div className="container-custom">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Our Latest Insights</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">Stay updated with the latest news, trends, and tutorials.</p>
          <div className="w-24 h-1.5 bg-emerald-500 rounded-full mx-auto mt-8 shadow-lg shadow-emerald-200"></div>
        </div>

        {blogs.length === 0 ? (
          <div className="card-premium p-16 text-center">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">No Blogs Found</h3>
            <p className="text-slate-500">Check back later for exciting reads.</p>
          </div>
        ) : (
          <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {blogs.map((blog) => (
              <BlogCard key={blog.blog_id} blog={blog}/>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default blogsPage
