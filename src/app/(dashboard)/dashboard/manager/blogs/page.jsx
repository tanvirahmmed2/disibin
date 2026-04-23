'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DataTable from '@/component/dashboard/DataTable'
import Link from 'next/link'
import { RiAddLine, RiEdit2Line, RiDeleteBin6Line, RiEyeLine } from 'react-icons/ri'
import { MdDeleteOutline, MdEditDocument } from 'react-icons/md'
import toast from 'react-hot-toast'

const EditorBlogs = () => {
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchBlogs = async () => {
        try {
            const res = await axios.get('/api/blog', { withCredentials: true })
            setBlogs(res.data.data || [])
        } catch (error) {
            console.error('Failed to fetch blogs', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this blog?')) return
        try {
            await axios.delete('/api/blog', { data: { id }, withCredentials: true })
            toast.success('Article deleted')
            fetchBlogs()
        } catch (error) {
            toast.error('Failed to delete blog')
        }
    }

    useEffect(() => {
        fetchBlogs()
    }, [])

    

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Blog Repository</h1>
                    <p className="text-slate-500 font-medium">Create, manage, and publish high-quality platform articles.</p>
                </div>
                <Link href="/dashboard/manager/blogs/new" className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-slate-900/10 hover:bg-emerald-500 transition-all active:scale-95">
                    <RiAddLine size={24} />
                    <span>New Article</span>
                </Link>
            </div>

               {
                blogs.length===0?<div className='w-full h-full flex items-center justify-center p-20 font-semibold'>
                    <p>No blog found</p>
                </div>:<div className='w-full flex flex-col items-center gap-1 font-semibold'>
                    <div className='w-full flex flex-row items-center justify-between bg-emerald-100 rounded-t-2xl p-4 '>
                        <p>Title</p>
                        <p>Actions</p>
                    </div>
                    {
                        blogs.map((blog)=>(
                            <div key={blog.blog_id} className='w-full flex flex-row items-center justify-between p-4 shadow even:bg-slate-100'>
                                <p>{blog.title}</p>
                                <div className='w-auto flex flex-row items-center justify-center gap-4 text-xl'>
                                    <Link href={`/dashboard/manager/blogs/${blog.slug}`}><MdEditDocument/></Link>
                                    <button onClick={()=>handleDelete(blog.blog_id)}><MdDeleteOutline/></button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            }
        </div>
    )
}

export default EditorBlogs
