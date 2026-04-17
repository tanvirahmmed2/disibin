'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DataTable from '@/component/dashboard/DataTable'
import { RiProjectorLine, RiExternalLinkLine } from 'react-icons/ri'

const PMProjects = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        try {
            const res = await axios.get('/api/project')
            setData(res.data.payload)
        } catch (error) {
            console.error('Failed to fetch projects', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const columns = [
        { label: 'Project Name', key: 'title', render: (row) => (
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <RiProjectorLine size={20} />
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-slate-700">{row.title}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{row.category}</span>
                </div>
            </div>
        )},
        { label: 'External Link', key: 'link', render: (row) => (
            row.link ? (
                <a href={row.link} target="_blank" className="text-primary hover:underline flex items-center gap-1 font-bold text-xs">
                    View Site <RiExternalLinkLine />
                </a>
            ) : <span className="text-slate-300 text-xs">No Link</span>
        )},
        { label: 'Created', key: 'createdAt', render: (row) => (
            <span className="text-xs text-slate-400 font-bold">{new Date(row.createdAt).toLocaleDateString()}</span>
        )},
    ]

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Project Portfolio</h1>
                <p className="text-slate-500 font-medium">Overview of all active and completed client projects.</p>
            </div>

            <div className="bg-white p-2 rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
                <DataTable columns={columns} data={data} loading={loading} />
            </div>
        </div>
    )
}

export default PMProjects
