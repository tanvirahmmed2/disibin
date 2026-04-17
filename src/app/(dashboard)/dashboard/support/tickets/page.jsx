'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import DataTable from '@/component/dashboard/DataTable'
import { RiMessage2Line, RiShareForwardLine, RiCheckboxCircleLine } from 'react-icons/ri'

const SupportTickets = () => {
    const router = useRouter()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        setLoading(true)
        try {
            const res = await axios.get('/api/ticket')
            setData(res.data.data)
        } catch (error) {
            console.error('Failed to fetch data', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const updateStatus = async (id, status) => {
        try {
            await axios.patch('/api/ticket', { id, status })
            fetchData()
        } catch (error) {
            alert('Failed to update status')
        }
    }

    const columns = [
        { label: 'Client', key: 'senderId', render: (row) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-700">{row.senderId?.name || 'Guest'}</span>
                <span className="text-xs text-slate-400">{row.senderId?.email || row.email}</span>
            </div>
        )},
        { label: 'Subject', key: 'subject', render: (row) => (
            <div className="flex flex-col">
                <span className="font-medium text-slate-600 truncate max-w-[200px]">{row.subject}</span>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{row.category}</span>
            </div>
        )},
        { label: 'Priority', key: 'priority', render: (row) => (
            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider
                ${row.priority === 'urgent' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
                {row.priority}
            </span>
        )},
        { label: 'Status', key: 'status', render: (row) => (
            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider
                ${row.status === 'open' ? 'bg-white text-white' : 
                  row.status === 'in_progress' ? 'bg-primary text-primary' : 
                  'bg-primary/10 text-primary'}`}>
                {row.status}
            </span>
        )},
    ]

    const actions = (row) => (
        <div className="flex gap-2">
            <button 
                onClick={() => router.push(`/dashboard/tickets/${row._id}`)}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-all font-bold text-xs flex items-center gap-1"
            >
                <RiMessage2Line size={18} /> Chat
            </button>
            <button className="p-2 hover:bg-primary rounded-lg text-primary transition-all" title="Forward to PM">
                <RiShareForwardLine size={18} />
            </button>
            {row.status !== 'closed' && (
                <button onClick={() => updateStatus(row._id, 'closed')} className="p-2 hover:bg-primary/5 rounded-lg text-primary transition-all" title="Close">
                    <RiCheckboxCircleLine size={18} />
                </button>
            )}
        </div>
    )

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Client Tickets</h1>
                <p className="text-slate-500">Manage and respond to active client support tickets.</p>
            </div>

            <div className="bg-white p-2 rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
                <DataTable columns={columns} data={data} loading={loading} actions={actions} />
            </div>
        </div>
    )
}

export default SupportTickets
