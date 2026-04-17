'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DataTable from './DataTable'
import { RiHistoryLine, RiFilter3Line } from 'react-icons/ri'

const ActivityLogView = ({ title = "System Activity Log" }) => {
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        action: '',
        targetType: ''
    })
    const [pagination, setPagination] = useState({
        page: 1,
        pages: 1
    })

    const fetchLogs = async (page = 1) => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page,
                limit: 15,
                ...filters
            })
            const res = await axios.get(`/api/logs?${params.toString()}`, { withCredentials: true })
            if (res.data.success) {
                setLogs(res.data.payload)
                setPagination(res.data.pagination)
            }
        } catch (error) {
            console.error('Failed to fetch logs', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLogs(1)
    }, [filters])

    const columns = [
        { label: 'Action', key: 'action', render: (row) => (
            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border
                ${row.action === 'create' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                  row.action === 'delete' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                  'bg-blue-50 text-blue-600 border-blue-100'}`}>
                {row.action}
            </span>
        )},
        { label: 'Target', key: 'targetType', render: (row) => (
            <span className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">{row.targetType}</span>
        )},
        { label: 'Description', key: 'description', render: (row) => (
            <span className="font-bold text-slate-700 text-sm">{row.description}</span>
        )},
        { label: 'User', key: 'userId', render: (row) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-800 text-xs">{row.userId?.name || 'System'}</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{row.userId?.role}</span>
            </div>
        )},
        { label: 'Timestamp', key: 'createdAt', render: (row) => (
            <span className="text-slate-400 text-xs font-medium">{new Date(row.createdAt).toLocaleString()}</span>
        )},
    ]

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h1>
                    <p className="text-slate-500 font-medium">Monitoring system-wide mutations and administrative actions.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <select 
                            value={filters.action}
                            onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                            className="appearance-none bg-white border border-slate-100 px-6 py-3 pr-12 rounded-xl text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-primary transition-all cursor-pointer"
                        >
                            <option value="">All Actions</option>
                            <option value="create">Create</option>
                            <option value="update">Update</option>
                            <option value="delete">Delete</option>
                        </select>
                        <RiFilter3Line className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="bg-white p-2 rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
                <DataTable 
                    columns={columns} 
                    data={logs} 
                    loading={loading} 
                />
            </div>

            {pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    {[...Array(pagination.pages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => fetchLogs(i + 1)}
                            className={`w-10 h-10 rounded-xl font-black text-xs transition-all
                                ${pagination.page === i + 1 ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400 hover:bg-slate-50'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ActivityLogView
