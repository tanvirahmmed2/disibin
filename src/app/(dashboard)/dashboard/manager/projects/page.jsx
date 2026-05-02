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
        { label: 'Project', key: 'title', render: (row) => (
            <div className="flex items-center gap-3">
                {row.image && (
                    <img src={row.image} alt="" className="w-10 h-10 border border-slate-200 object-cover" />
                )}
                <div>
                    <p className="font-bold text-slate-900 uppercase tracking-tight text-xs leading-none mb-1">{row.title}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">{row.category_name || 'Uncategorized'}</p>
                </div>
            </div>
        )},
        { label: 'Link', key: 'live_url', render: (row) => (
            row.live_url ? (
                <a href={row.live_url} target="_blank" className="text-slate-900 hover:underline flex items-center gap-1 font-bold text-[10px] uppercase tracking-widest">
                    Live <RiExternalLinkLine />
                </a>
            ) : <span className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">N/A</span>
        )},
        { label: 'Created', key: 'created_at', render: (row) => (
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(row.created_at).toLocaleDateString()}</span>
        )},
    ]

    const actions = (row) => (
        <div className="flex gap-1">
            <Link 
                href={`/dashboard/manager/projects/${row.slug}`}
                className="p-2 border border-slate-200 text-slate-400 hover:text-slate-800 transition-all"
                title="Edit"
            >
                <RiProjectorLine size={16} />
            </Link>
            <button 
                onClick={() => handleDelete(row.project_id)}
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
                    <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Projects</h1>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Portfolio management.</p>
                </div>
                <Link href="/dashboard/manager/projects/new" className="bg-slate-900 text-white px-4 py-2 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2">
                    <RiAddLine size={16} /> New Project
                </Link>
            </div>

            <div className="bg-white border border-slate-200 overflow-hidden">
                <DataTable columns={columns} data={data} loading={loading} actions={actions} />
            </div>
        </div>
    )
}

export default PMProjects
