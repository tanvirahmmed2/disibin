'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DataTable from '@/component/dashboard/DataTable'
import { RiTicketLine, RiInformationLine } from 'react-icons/ri'

const AdminTickets = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        try {
            const res = await axios.get('/api/ticket')
            setData(res.data.data)
        } catch (error) {
            console.error('Failed to fetch tickets', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const columns = [
        { label: 'Client', key: 'senderId', render: (row) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-700">{row.senderId?.name || 'Guest'}</span>
                <span className="text-xs text-slate-400 font-medium">{row.senderId?.email || row.email}</span>
            </div>
        )},
        { label: 'Subject', key: 'subject', render: (row) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-600 truncate max-w-[200px]">{row.subject}</span>
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">{row.category}</span>
            </div>
        )},
        { label: 'Status', key: 'status', render: (row) => (
            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider
                ${row.status === 'open' ? 'bg-white text-white' : 
                  row.status === 'in_progress' ? 'bg-primary text-primary' : 
                  'bg-primary/10 text-primary-dark'}`}>
                {row.status.replace('_', ' ')}
            </span>
        )},
        { label: 'Created', key: 'createdAt', render: (row) => (
            <span className="text-xs text-slate-400 font-bold">{new Date(row.createdAt).toLocaleDateString()}</span>
        )},
    ]

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">System-Wide Tickets</h1>
                <p className="text-slate-500 font-medium">Administrator view of all customer support interactions.</p>
            </div>

            <div className="bg-white p-2 rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
                <DataTable columns={columns} data={data} loading={loading} />
            </div>
        </div>
    )
}

export default AdminTickets
