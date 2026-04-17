'use client'
import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import DataTable from '@/component/dashboard/DataTable'
import { Context } from '@/component/helper/Context'
import { RiAddLine, RiChat3Line, RiInformationLine } from 'react-icons/ri'

const ClientTickets = () => {
    const router = useRouter()
    const { userData } = useContext(Context)
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchTickets = async () => {
        try {
            const res = await axios.get('/api/ticket')
            setTickets(res.data.payload)
        } catch (error) {
            console.error('Failed to fetch tickets', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (userData?._id) fetchTickets()
    }, [userData])

    const columns = [
        { label: 'Subject', key: 'subject', render: (row) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-700">{row.subject}</span>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{row.category}</span>
            </div>
        )},
        { label: 'Priority', key: 'priority', render: (row) => (
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider
                ${row.priority === 'urgent' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
                {row.priority}
            </span>
        )},
        { label: 'Status', key: 'status', render: (row) => (
            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                ${row.status === 'open' ? 'bg-emerald-100 text-emerald-700' : 
                  row.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 
                  'bg-slate-100 text-slate-500'}`}>
                {row.status}
            </span>
        )},
        { label: 'Last Activity', key: 'lastMessageAt', render: (row) => (
            <span className="text-slate-400 text-xs">{new Date(row.lastMessageAt || row.createdAt).toLocaleString()}</span>
        )},
    ]

    const actions = (row) => (
        <div className="flex gap-2">
            <button className="flex items-center gap-1 p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-all font-bold text-xs">
                <RiChat3Line size={18} /> Chat
            </button>
            <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-all">
                <RiInformationLine size={18} />
            </button>
        </div>
    )

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Support Tickets</h1>
                    <p className="text-slate-500 font-medium whitespace-nowrap overflow-hidden">Manage and track your active support conversations.</p>
                </div>
                <button 
                    onClick={() => router.push('/dashboard/tickets/new')}
                    className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-slate-900/10 hover:bg-primary transition-all active:scale-95"
                >
                    <RiAddLine size={20} />
                    <span>Open Ticket</span>
                </button>
            </div>

            <div className="bg-white p-2 rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
                <DataTable 
                    columns={columns} 
                    data={tickets} 
                    loading={loading} 
                    actions={actions} 
                />
            </div>
        </div>
    )
}

export default ClientTickets
