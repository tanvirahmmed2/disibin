'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import DataTable from '@/component/dashboard/DataTable'
import { RiMessage2Line, RiHistoryLine, RiCheckboxCircleLine, RiInformationLine } from 'react-icons/ri'
import toast from 'react-hot-toast'

const ManagerTickets = () => {
    const router = useRouter()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchTickets = async () => {
        setLoading(true)
        try {
            const res = await axios.get('/api/ticket')
            setData(res.data.data || [])
        } catch (error) {
            console.error('Failed to fetch tickets', error)
            toast.error('Failed to load tickets')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTickets()
    }, [])

    const updateTicketStatus = async (id, status) => {
        try {
            await axios.patch('/api/ticket', { id, status })
            toast.success(`Ticket ${status}`)
            fetchTickets()
        } catch (error) {
            toast.error('Failed to update ticket')
        }
    }

    const columns = [
        { label: 'Ticket Info', key: 'ticket_id', render: (row) => (
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 font-bold text-xs">
                    #{row.ticket_id}
                </div>
                <div>
                    <p className="font-bold text-slate-700">{row.subject}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{row.category || 'General'}</p>
                </div>
            </div>
        )},
        { label: 'Client', key: 'sender_name', render: (row) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-600">{row.sender_name}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">{row.sender_email}</span>
            </div>
        )},
        { label: 'Priority', key: 'priority', render: (row) => (
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest
                ${row.priority === 'urgent' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                {row.priority}
            </span>
        )},
        { label: 'Status', key: 'status', render: (row) => (
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest
                ${row.status === 'open' ? 'bg-emerald-100 text-emerald-700' : 
                  row.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 
                  'bg-slate-50 text-slate-400'}`}>
                {row.status}
            </span>
        )},
    ]

    const actions = (row) => (
        <div className="flex gap-2">
            <button 
                onClick={() => router.push(`/dashboard/manager/tickets/${row.ticket_id}`)}
                className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-all"
                title="Open Chat"
            >
                <RiMessage2Line size={18} />
            </button>
            {row.status !== 'closed' && (
                <button 
                    onClick={() => updateTicketStatus(row.ticket_id, 'closed')}
                    className="p-2 hover:bg-slate-100 text-slate-400 hover:text-red-500 rounded-lg transition-all"
                    title="Close Ticket"
                >
                    <RiCheckboxCircleLine size={18} />
                </button>
            )}
        </div>
    )

    return (
        <div className="space-y-6 py-6 px-4">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-slate-800">My Assigned Tickets</h1>
                    <p className="text-sm text-slate-500">Manage support tickets assigned specifically to you.</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <RiInformationLine size={20} />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <DataTable columns={columns} data={data} loading={loading} actions={actions} />
            </div>
        </div>
    )
}

export default ManagerTickets
