'use client'
import React, { useState, useEffect } from 'react'
import UpdateBlogForm from '@/component/forms/UpdateBlogForm'
import { RiArrowLeftLine } from 'react-icons/ri'
import Link from 'next/link'
import axios from 'axios'
import { useParams } from 'next/navigation'

const EditBlogPage = () => {
    const { slug } = useParams()
    const [blog, setBlog] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await axios.get(`/api/blog/${slug}`)
                setBlog(res.data.data)
            } catch (error) {
                console.error('Failed to fetch blog', error)
            } finally {
                setLoading(false)
            }
        }
        if (slug) fetchBlog()
    }, [slug])

    if (loading) return (
        <div className="flex items-center justify-center py-20 px-4">
            <div className="w-12 h-12 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
    )

    if (!blog) return <div className="p-10 text-center font-bold text-slate-400 uppercase tracking-widest">Article Not Found</div>

    return (
        <div className="space-y-4 max-w-4xl mx-auto">
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-4">
                <Link 
                    href="/dashboard/manager/blogs" 
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-bold text-[10px] uppercase tracking-widest"
                >
                    <RiArrowLeftLine size={14} /> Back to Blogs
                </Link>
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Edit Blog</h1>
                    <p className="text-xs text-slate-500">Update the content, category or visual of your published material.</p>
                </div>
            </div>

            <div className="bg-white p-6 border border-slate-200">
                <UpdateBlogForm blogData={blog} />
            </div>
        </div>
    )
}

export default EditBlogPage
