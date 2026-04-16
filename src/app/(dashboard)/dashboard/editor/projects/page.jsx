'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DataTable from '@/component/dashboard/DataTable'
import Link from 'next/link'
import { RiAddLine, RiEdit2Line, RiDeleteBin6Line } from 'react-icons/ri'

const EditorProjects = () => {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchProjects = async () => {
        try {
            const res = await axios.get('/api/project', { withCredentials: true })
            setProjects(res.data.payload)
        } catch (error) {
            console.error('Failed to fetch projects', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return
        try {
            await axios.delete('/api/project', { data: { id }, withCredentials: true })
            fetchProjects()
        } catch (error) {
            alert('Failed to delete project')
        }
    }

    useEffect(() => {
        fetchProjects()
    }, [])

    const columns = [
        { label: 'Project', key: 'title', render: (row) => (
            <div className="flex items-center gap-3">
                <img src={row.image} alt="project" className="w-10 h-10 rounded-xl object-cover border border-slate-100" />
                <div className="flex flex-col">
                    <span className="font-bold text-slate-700">{row.title}</span>
                    <span className="text-[10px] text-emerald-600 font-bold uppercase">{row.category}</span>
                </div>
            </div>
        )},
        { label: 'Price', key: 'price', render: (row) => (
            <span className="font-bold text-slate-900">${row.price}</span>
        )},
    ]

    const actions = (row) => (
        <div className="flex gap-2">
            <Link href={`/dashboard/projects/${row.slug}`} className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-all">
                <RiEdit2Line size={18} />
            </Link>
            <button onClick={() => handleDelete(row._id)} className="p-2 hover:bg-rose-50 rounded-lg text-rose-500 transition-all">
                <RiDeleteBin6Line size={18} />
            </button>
        </div>
    )

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Showcase Projects</h1>
                    <p className="text-slate-500">Manage the project portfolio and case studies.</p>
                </div>
                <Link href="/dashboard/new-project" className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all">
                    <RiAddLine size={24} />
                    <span>New Project</span>
                </Link>
            </div>

            <div className="bg-white p-2 rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
                <DataTable columns={columns} data={projects} loading={loading} actions={actions} />
            </div>
        </div>
    )
}

export default EditorProjects
