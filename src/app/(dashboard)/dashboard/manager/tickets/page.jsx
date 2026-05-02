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
        { label: 'Ticket', key: 'ticket_id', render: (row) => (
            <div className="flex items-center gap-3">
                <div className="p-2 border border-slate-200 text-slate-400 font-bold text-[10px] uppercase">
                    #{row.ticket_id}
                </div>
                <div>
                    <p className="font-bold text-slate-900 uppercase tracking-tight text-xs">{row.subject}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{row.category || 'General'}</p>
                </div>
            </div>
        )},
        { label: 'Client', key: 'sender_name', render: (row) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-700 uppercase tracking-tight text-xs">{row.sender_name}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{row.sender_email}</span>
            </div>
        )},
        { label: 'Priority', key: 'priority', render: (row) => (
            <span className={`px-2 py-0.5 border text-[9px] font-bold uppercase tracking-widest
                ${row.priority === 'urgent' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                {row.priority}
            </span>
        )},
        { label: 'Status', key: 'status', render: (row) => (
            <span className={`px-2 py-0.5 border text-[9px] font-bold uppercase tracking-widest
                ${row.status === 'open' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                  row.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                  'bg-slate-50 text-slate-500 border-slate-200'}`}>
                {row.status}
            </span>
        )},
    ]

    const actions = (row) => (
        <div className="flex gap-1">
            <button 
                onClick={() => router.push(`/dashboard/manager/tickets/${row.ticket_id}`)}
                className="p-2 border border-slate-200 text-slate-400 hover:text-slate-900 transition-all"
                title="Chat"
            >
                <RiMessage2Line size={16} />
            </button>
            {row.status !== 'closed' && (
                <button 
                    onClick={() => updateTicketStatus(row.ticket_id, 'closed')}
                    className="p-2 border border-slate-200 text-slate-400 hover:text-red-500 transition-all"
                    title="Close"
                >
                    <RiCheckboxCircleLine size={16} />
                </button>
            )}
        </div>
    )

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="space-y-1">
                    <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Tickets</h1>
                    <p className="text-xs text-slate-500">Manage support tickets assigned specifically to you.</p>
                </div>
            </div>

            <div className="bg-white border border-slate-200 overflow-hidden">
                <DataTable columns={columns} data={data} loading={loading} actions={actions} />
            </div>
        </div>
    )
}

export default ManagerTickets
