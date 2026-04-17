'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DataTable from '@/component/dashboard/DataTable'
import Link from 'next/link'
import { RiAddLine, RiEdit2Line, RiDeleteBin6Line, RiEyeLine } from 'react-icons/ri'

const EditorBlogs = () => {
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchBlogs = async () => {
        try {
            const res = await axios.get('/api/blog', { withCredentials: true })
            setBlogs(res.data.data)
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
            fetchBlogs()
        } catch (error) {
            alert('Failed to delete blog')
        }
    }

    useEffect(() => {
        fetchBlogs()
    }, [])

    const columns = [
        { label: 'Image', key: 'image', render: (row) => (
            <img src={row.image} alt="blog" className="w-10 h-10 rounded-xl object-cover border border-slate-100" />
        )},
        { label: 'Title', key: 'title', render: (row) => (
            <div className="flex flex-col max-w-xs">
                <span className="font-black text-slate-800 tracking-tight truncate">{row.title}</span>
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">{row.category}</span>
            </div>
        )},
        { label: 'Author', key: 'author', render: (row) => (
            <span className="text-slate-500 font-bold text-xs italic">@{row.author || 'system'}</span>
        )},
        { label: 'Created At', key: 'createdAt', render: (row) => (
            <span className="text-xs text-slate-400 font-bold">{new Date(row.createdAt).toLocaleDateString()}</span>
        )},
    ]

    const actions = (row) => (
        <div className="flex gap-2">
            <Link href={`/blogs/${row.slug}`} target="_blank" className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-all">
                <RiEyeLine size={18} />
            </Link>
            <Link href={`/dashboard/editor/blogs/${row._id}`} className="p-2 hover:bg-primary/5 rounded-lg text-primary transition-all">
                <RiEdit2Line size={18} />
            </Link>
            <button onClick={() => handleDelete(row._id)} className="p-2 hover:bg-primary rounded-lg text-primary transition-all">
                <RiDeleteBin6Line size={18} />
            </button>
        </div>
    )

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Blog Repository</h1>
                    <p className="text-slate-500 font-medium">Create, manage, and publish high-quality platform articles.</p>
                </div>
                <Link href="/dashboard/editor/blogs/new" className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-slate-900/10 hover:bg-primary transition-all active:scale-95">
                    <RiAddLine size={24} />
                    <span>New Article</span>
                </Link>
            </div>

            <div className="bg-white p-2 rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
                <DataTable columns={columns} data={blogs} loading={loading} actions={actions} />
            </div>
        </div>
    )
}

export default EditorBlogs
