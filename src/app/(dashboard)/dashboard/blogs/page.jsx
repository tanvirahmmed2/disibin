import { BASE_URL } from '@/lib/database/secret'
import Link from 'next/link'
import React from 'react'

const blogs = async () => {
  const res = await fetch(`${BASE_URL}/api/blog`, {
    method: 'GET',
    cache: 'no-store'
  })

  const data = await res.json()

  if (!data.success) return <div className='w-full flex items-center justify-center'>
    <p>No Data Found!</p>
  </div>
  const blogs = data.payload

  return (
    <div className='w-full  min-h-screen flex flex-col items-center gap-4 p-4'>
      {
        blogs.length === 0 ? <div>
          <p>blog data not found</p>
        </div> : <div className='w-full flex flex-col items-center justify-center gap-4 '>

          <h1 className='text-center text-xl font-semibold'>Our Latest blogs</h1>
          <div className='w-full flex flex-col items-center gap-1'>
            {
              blogs.map((blog) => (
                <div key={blog._id} className='w-full grid grid-cols-7 even:bg-gray-100 p-2'>
                  <Link href={`/blogs/${blog.slug}`} className='col-span-6'>{blog.title}</Link>
                  <div className='col-span-1 flex items-center justify-center flex-row gap-2'>
                    <Link href={`/blogs/${blog.slug}`}>Edit</Link>
                    <button>Delete</button>
                  </div>

                </div>
              ))
            }
          </div>
        </div>
      }
    </div>
  )
}

export default blogs
