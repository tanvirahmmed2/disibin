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
        { label: 'Ticket Info', key: 'subject', render: (row) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-800">{row.subject}</span>
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Case #{row.ticket_id}</span>
            </div>
        )},
        { label: 'Priority', key: 'priority', render: (row) => (
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase
                ${row.priority === 'urgent' ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-500'}`}>
                {row.priority}
            </span>
        )},
        { label: 'Status', key: 'status', render: (row) => (
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase
                ${row.status === 'open' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400'}`}>
                {row.status}
            </span>
        )},
        { label: 'Created', key: 'created_at', render: (row) => (
            <span className="text-slate-500 text-xs">{new Date(row.created_at).toLocaleDateString()}</span>
        )},
    ]

    const actions = (row) => (
        <button 
            onClick={() => router.push(`/user/tickets/${row.ticket_id}`)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-emerald-500 hover:text-white transition-all text-xs font-bold"
        >
            <RiMessage2Line size={16} /> Chat
        </button>
    )

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Support Tickets</h1>
                    <p className="text-slate-500 text-sm">Track and manage your inquiries with our team.</p>
                </div>
                <button 
                    onClick={() => router.push('/user/tickets/new')}
                    className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center gap-2"
                >
                    <RiAddLine size={20} /> New Ticket
                </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
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
