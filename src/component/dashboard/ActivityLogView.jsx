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

    const fetchLogs = React.useCallback(async (page = 1) => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page,
                limit: 15,
                ...filters
            })
            const res = await axios.get(`/api/logs?${params.toString()}`, { withCredentials: true })
            if (res.data.success) {
                setLogs(res.data.data)
                setPagination(res.data.pagination)
            }
        } catch (error) {
            console.error('Failed to fetch logs', error)
        } finally {
            setLoading(false)
        }
    }, [filters])

    useEffect(() => {
        fetchLogs(1)
    }, [filters, fetchLogs])

    const columns = [
        { label: 'Action', key: 'action', render: (row) => (
            <span className={`px-2 py-0.5 border text-[9px] font-bold uppercase tracking-widest
                ${row.action === 'create' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                  row.action === 'delete' ? 'bg-red-50 text-red-700 border-red-100' : 
                  'bg-slate-50 text-slate-700 border-slate-200'}`}>
                {row.action}
            </span>
        )},
        { label: 'Target', key: 'targetType', render: (row) => (
            <span className="font-bold text-slate-400 text-[9px] uppercase tracking-widest">{row.targetType}</span>
        )},
        { label: 'Description', key: 'description', render: (row) => (
            <span className="font-bold text-slate-900 text-xs uppercase tracking-tight">{row.description}</span>
        )},
        { label: 'User', key: 'userId', render: (row) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-700 text-[10px] uppercase tracking-tight">{row.userId?.name || 'System'}</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{row.userId?.role}</span>
            </div>
        )},
        { label: 'Timestamp', key: 'createdAt', render: (row) => (
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{new Date(row.createdAt).toLocaleString()}</span>
        )},
    ]

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">{title}</h1>
                    <p className="text-xs text-slate-500">Monitoring system-wide mutations and administrative actions.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <select 
                            value={filters.action}
                            onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                            className="appearance-none bg-white border border-slate-200 px-4 py-2 pr-10 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-slate-400 transition-all cursor-pointer"
                        >
                            <option value="">All Actions</option>
                            <option value="create">Create</option>
                            <option value="update">Update</option>
                            <option value="delete">Delete</option>
                        </select>
                        <RiFilter3Line className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 overflow-hidden">
                <DataTable 
                    columns={columns} 
                    data={logs} 
                    loading={loading} 
                />
            </div>

            {pagination.pages > 1 && (
                <div className="flex justify-center gap-1 mt-4">
                    {[...Array(pagination.pages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => fetchLogs(i + 1)}
                            className={`px-3 py-1 border font-bold text-[10px] transition-all
                                ${pagination.page === i + 1 ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
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
