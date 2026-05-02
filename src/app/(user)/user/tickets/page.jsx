'use client'
import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import DataTable from '@/component/dashboard/DataTable'
import { Context } from '@/component/helper/Context'
import { RiMessage2Line, RiAddLine, RiTicketLine } from 'react-icons/ri'
import { useRouter } from 'next/navigation'

const ClientTickets = () => {
    const router = useRouter()
    const { isLoggedIn } = useContext(Context)
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchTickets = async () => {
        try {
            const res = await axios.get('/api/ticket?personal=true', { withCredentials: true })
            setTickets(res.data.data)
        } catch (error) {
            console.error('Failed to fetch tickets', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isLoggedIn) fetchTickets()
    }, [isLoggedIn])

    const columns = [
        { label: 'Ticket', key: 'subject', render: (row) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-900 text-xs uppercase tracking-tight leading-none mb-1">{row.subject}</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Case #{row.ticket_id}</span>
            </div>
        )},
        { label: 'Priority', key: 'priority', render: (row) => (
            <span className={`px-2 py-0.5 border text-[9px] font-bold uppercase tracking-widest
                ${row.priority === 'urgent' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                {row.priority}
            </span>
        )},
        { label: 'Status', key: 'status', render: (row) => (
            <span className={`px-2 py-0.5 border text-[9px] font-bold uppercase tracking-widest
                ${row.status === 'open' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                {row.status}
            </span>
        )},
        { label: 'Created', key: 'created_at', render: (row) => (
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(row.created_at).toLocaleDateString()}</span>
        )},
    ]

    const actions = (row) => (
        <button
            onClick={() => router.push(`/user/tickets/${row.ticket_id}`)}
            className="px-3 py-1.5 border border-slate-200 text-slate-500 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all text-[9px] font-bold uppercase tracking-widest flex items-center gap-1"
        >
            <RiMessage2Line size={12} /> Chat
        </button>
    )

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Support Tickets</h1>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Track your inquiries with our team.</p>
                </div>
                <button
                    onClick={() => router.push('/user/tickets/new')}
                    className="bg-slate-900 text-white px-4 py-2 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2"
                >
                    <RiAddLine size={16} /> New Ticket
                </button>
            </div>

            <div className="bg-white border border-slate-200 overflow-hidden">
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
