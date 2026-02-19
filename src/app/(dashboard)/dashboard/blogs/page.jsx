
'use client'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const blogs = () => {

  const [blogs, setBlogs] = useState([])

  const fetchBlogs = async () => {
    try {
      const res = await axios.get('/api/blog', { withCredentials: true })
      setBlogs(res.data.payload)
    } catch (error) {
      setBlogs([])
      console.log(error)

    }
  }


  const handleDelete=async(id)=>{
    const confirm= window.confirm('Are you sure?')
    if(!confirm) return
    try {
      const res= await axios.delete('/api/blog', {data:{id}, withCredentials:true})
      fetchBlogs()
      alert(res.data.message)
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to delete blog data")
      
    }
  }


  useEffect(() => {
    fetchBlogs()
  }, [])

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
                <div key={blog.blog_id} className='w-full grid grid-cols-8 even:bg-gray-200 rounded-xl border border-black/30 shadow p-2'>
                  <Image src={blog.image} alt='blog image' width={50} height={50} className='col-span-1 rounded-2xl' />
                  <Link href={`/blogs/${blog.slug}`} className='col-span-2 font-bold'>{blog.title}</Link>
                  <p className='col-span-3'>{blog.description.slice(0, 100)}...</p>
                  <p className='col-span-1'>{blog.category}</p>
                  <div className='col-span-1 flex items-center justify-center flex-col gap-1'>
                    <Link href={`/dashboard/blogs/${blog.slug}`} className='w-full bg-green-500 text-center text-white cursor-pointer'>Edit</Link>
                    <button onClick={() => handleDelete(blog.blog_id)} className='w-full bg-red-500 text-center text-white cursor-pointer'>Delete</button>
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
