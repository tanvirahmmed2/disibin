'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DataTable from '@/component/dashboard/DataTable'
import { RiMessage2Line, RiFlag2Line, RiCheckLine } from 'react-icons/ri'

const PMTickets = () => {
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchTickets = async () => {
        try {
            // Fetch project category tickets
            const res = await axios.get('/api/ticket?category=project')
            setTickets(res.data.payload)
        } catch (error) {
            console.error('Failed to fetch tickets', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTickets()
    }, [])

    const updateStatus = async (id, status) => {
        try {
            await axios.patch('/api/ticket', { id, status })
            fetchTickets()
        } catch (error) {
            alert('Failed to update status')
        }
    }

    const columns = [
        { label: 'Client', key: 'senderId', render: (row) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-700">{row.senderId?.name}</span>
                <span className="text-xs text-slate-400">{row.senderId?.email}</span>
            </div>
        )},
        { label: 'Project', key: 'projectId', render: (row) => (
            <span className="font-medium text-blue-600">{row.projectId?.title || 'General Project'}</span>
        )},
        { label: 'Subject', key: 'subject', render: (row) => (
            <p className="font-medium text-slate-600 truncate max-w-[200px]">{row.subject}</p>
        )},
        { label: 'Priority', key: 'priority', render: (row) => (
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider
                ${row.priority === 'urgent' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
                {row.priority}
            </span>
        )},
        { label: 'Status', key: 'status', render: (row) => (
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider
                ${row.status === 'open' ? 'bg-amber-100 text-amber-700' : 
                  row.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 
                  'bg-emerald-100 text-emerald-700'}`}>
                {row.status}
            </span>
        )},
    ]

    const actions = (row) => (
        <div className="flex gap-2">
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-all font-bold text-xs flex items-center gap-1">
                <RiMessage2Line size={18} /> Chat
            </button>
            {row.status === 'open' && (
                <button onClick={() => updateStatus(row._id, 'in_progress')} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-all" title="Start Working">
                    <RiFlag2Line size={18} />
                </button>
            )}
            {row.status !== 'closed' && (
                <button onClick={() => updateStatus(row._id, 'resolved')} className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-all" title="Mark Resolved">
                    <RiCheckLine size={18} />
                </button>
            )}
        </div>
    )

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Project Tickets</h1>
                <p className="text-slate-500">Respond to project-specific inquiries and technical issues.</p>
            </div>

            <div className="bg-white p-2 rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
                <DataTable columns={columns} data={tickets} loading={loading} actions={actions} />
            </div>
        </div>
    )
}

export default PMTickets
