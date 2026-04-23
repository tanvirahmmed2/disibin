'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DataTable from '@/component/dashboard/DataTable'
import { RiProjectorLine, RiExternalLinkLine, RiAddLine, RiDeleteBin6Line } from 'react-icons/ri'
import toast from 'react-hot-toast'

const PMProjects = () => {
    const router = useRouter()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        setLoading(true)
        try {
            const res = await axios.get('/api/project')
            setData(res.data.data || [])
        } catch (error) {
            console.error('Failed to fetch projects', error)
            toast.error('Failed to load projects')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this project?')) return
        try {
            await axios.delete('/api/project', { data: { id } })
            toast.success('Project deleted')
            fetchData()
        } catch (error) {
            toast.error('Failed to delete project')
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const columns = [
        { label: 'Project Portfolio', key: 'title', render: (row) => (
            <div className="flex items-center gap-4">
                {row.image && (
                    <img src={row.image} alt="" className="w-12 h-12 rounded-lg object-cover border border-slate-100" />
                )}
                <div>
                    <p className="font-bold text-slate-800">{row.title}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{row.category_name || 'Uncategorized'}</p>
                </div>
            </div>
        )},
        { label: 'External Link', key: 'live_url', render: (row) => (
            row.live_url ? (
                <a href={row.live_url} target="_blank" className="text-primary hover:underline flex items-center gap-1 font-bold text-xs">
                    View Live <RiExternalLinkLine />
                </a>
            ) : <span className="text-slate-300 text-xs">No Link</span>
        )},
        { label: 'Created', key: 'created_at', render: (row) => (
            <span className="text-xs text-slate-400 font-bold">{new Date(row.created_at).toLocaleDateString()}</span>
        )},
    ]

    const actions = (row) => (
        <div className="flex gap-2">
            <Link 
                href={`/dashboard/manager/projects/${row.slug}`}
                className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-all"
            >
                <RiProjectorLine size={18} />
            </Link>
            <button 
                onClick={() => handleDelete(row.project_id)}
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
                    <h1 className="text-2xl font-bold text-slate-800">Project Portfolio</h1>
                    <p className="text-sm text-slate-500">Overview and management of all active and completed client projects.</p>
                </div>
                <Link href="/dashboard/manager/projects/new" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg shadow-slate-900/10 flex items-center gap-2">
                    <RiAddLine size={18} /> New Project
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <DataTable columns={columns} data={data} loading={loading} actions={actions} />
            </div>
        </div>
    )
}

export default PMProjects
