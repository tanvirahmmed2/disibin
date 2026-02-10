
import BlogCard from '@/component/card/BlogCard'
import { BASE_URL } from '@/lib/database/secret'
import React from 'react'

const blogsPage = async () => {
  const res = await fetch(`${BASE_URL}/api/blog`, {
    method: 'GET',
    cache: 'no-store'
  })

  const data = await res.json()

  if (!data.success) return <div className='w-full flex items-center justify-center'>
    <p>No Data Found!</p>
  </div>
  const blogs= data.payload


  return (
    <div className='w-full  min-h-screen flex flex-col items-center gap-4 p-4'>
      {
        blogs.length === 0 ? <div>
          <p>blog data not found</p>
        </div> : <div className='w-full flex flex-col items-center justify-center gap-4 '>

          <h1 className='text-center text-xl font-semibold'>Our Latest blogs</h1>
          <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {
              blogs.map((blog)=>(
                <BlogCard key={blog._id} blog={blog}/>
              ))
            }
          </div>
        </div>
      }
    </div>
  )
}

export default blogsPage
