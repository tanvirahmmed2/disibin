'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import DataTable from '@/component/dashboard/DataTable'
import Link from 'next/link'
import { RiAddLine, RiEdit2Line, RiDeleteBin6Line, RiEyeLine } from 'react-icons/ri'
import { MdDeleteOutline, MdEditDocument } from 'react-icons/md'
import toast from 'react-hot-toast'

const EditorBlogs = () => {
    const router = useRouter()
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchBlogs = async () => {
        setLoading(true)
        try {
            const res = await axios.get('/api/blog')
            setBlogs(res.data.data || [])
        } catch (error) {
            console.error('Failed to fetch blogs', error)
            toast.error('Failed to load blogs')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this blog?')) return
        try {
            await axios.delete('/api/blog', { data: { id } })
            toast.success('Article deleted')
            fetchBlogs()
        } catch (error) {
            toast.error('Failed to delete blog')
        }
    }

    useEffect(() => {
        fetchBlogs()
    }, [])

    const columns = [
        { label: 'Article', key: 'title', render: (row) => (
            <div className="flex items-center gap-3">
                {row.image && (
                    <img src={row.image} alt="" className="w-8 h-8 border border-slate-200 object-cover" />
                )}
                <div>
                    <p className="font-bold text-slate-900 uppercase tracking-tight text-xs leading-none mb-1">{row.title}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">{new Date(row.created_at).toLocaleDateString()}</p>
                </div>
            </div>
        )},
        { label: 'Slug', key: 'slug', render: (row) => (
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5">{row.slug}</span>
        )},
    ]

    const actions = (row) => (
        <div className="flex gap-1">
            <Link 
                href={`/dashboard/manager/blogs/${row.slug}`}
                className="p-2 border border-slate-200 text-slate-400 hover:text-slate-800 transition-all"
                title="Edit"
            >
                <RiEdit2Line size={16} />
            </Link>
            <button 
                onClick={() => handleDelete(row.blog_id)}
                className="p-2 border border-slate-200 text-slate-400 hover:text-red-500 transition-all"
                title="Delete"
            >
                <RiDeleteBin6Line size={16} />
            </button>
        </div>
    )

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="space-y-1">
                    <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Blogs</h1>
                    <p className="text-xs text-slate-500">Manage and publish platform articles.</p>
                </div>
                <Link href="/dashboard/manager/blogs/new" className="bg-slate-900 text-white px-4 py-2 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2">
                    <RiAddLine size={16} /> New Article
                </Link>
            </div>

            <div className="bg-white border border-slate-200 overflow-hidden">
                <DataTable columns={columns} data={blogs} loading={loading} actions={actions} />
            </div>
        </div>
    )
}

export default EditorBlogs
