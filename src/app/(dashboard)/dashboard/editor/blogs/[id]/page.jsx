'use client'
import React, { useState, useEffect } from 'react'
import UpdateBlogForm from '@/component/forms/UpdateBlogForm'
import { RiArrowLeftLine } from 'react-icons/ri'
import Link from 'next/link'
import axios from 'axios'
import { useParams } from 'next/navigation'

const EditBlogPage = () => {
    const { id } = useParams()
    const [blog, setBlog] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await axios.get(`/api/blog/${id}`)
                setBlog(res.data.payload)
            } catch (error) {
                console.error('Failed to fetch blog', error)
            } finally {
                setLoading(false)
            }
        }
        if (id) fetchBlog()
    }, [id])

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-12 h-12 border-4 border-slate-50 border-t-primary rounded-full animate-spin"></div>
        </div>
    )

    if (!blog) return <div className="p-10 text-center font-bold text-slate-400 font-black uppercase tracking-widest">Article Not Found</div>

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4">
                <Link 
                    href="/dashboard/editor/blogs" 
                    className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-bold text-xs uppercase tracking-widest"
                >
                    <RiArrowLeftLine size={16} /> Back to Repository
                </Link>
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Modify Article</h1>
                    <p className="text-slate-500 font-medium">Update the content, category or visual of your published material.</p>
                </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm">
                <UpdateBlogForm blog={blog} />
            </div>
        </div>
    )
}

export default EditBlogPage
