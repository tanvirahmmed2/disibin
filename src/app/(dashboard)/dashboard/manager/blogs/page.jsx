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
            <div className="flex items-center gap-4">
                {row.image && (
                    <img src={row.image} alt="" className="w-12 h-12 rounded-lg object-cover border border-slate-100" />
                )}
                <div>
                    <p className="font-bold text-slate-800">{row.title}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(row.created_at).toLocaleDateString()}</p>
                </div>
            </div>
        )},
        { label: 'Slug', key: 'slug', render: (row) => (
            <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded">{row.slug}</span>
        )},
    ]

    const actions = (row) => (
        <div className="flex gap-2">
            <Link 
                href={`/dashboard/manager/blogs/${row.slug}`}
                className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-all"
            >
                <RiEdit2Line size={18} />
            </Link>
            <button 
                onClick={() => handleDelete(row.blog_id)}
                className="p-2 hover:bg-slate-100 text-slate-400 hover:text-red-500 rounded-lg transition-all"
            >
                <RiDeleteBin6Line size={18} />
            </button>
        </div>
    )

    return (
        <div className="space-y-6 py-6 px-4">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-slate-800">Blog Repository</h1>
                    <p className="text-sm text-slate-500">Manage and publish high-quality platform articles.</p>
                </div>
                <Link href="/dashboard/manager/blogs/new" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg shadow-slate-900/10 flex items-center gap-2">
                    <RiAddLine size={18} /> New Article
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <DataTable columns={columns} data={blogs} loading={loading} actions={actions} />
            </div>
        </div>
    )
}

export default EditorBlogs
