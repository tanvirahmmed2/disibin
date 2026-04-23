'use client'
import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import DataTable from '@/component/dashboard/DataTable'
import { Context } from '@/component/helper/Context'
import { RiMessage2Line, RiShareForwardLine, RiCheckboxCircleLine } from 'react-icons/ri'

const GlobalTickets = () => {
    const router = useRouter()
    const { userData } = useContext(Context)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    const isStaff = ['admin', 'manager', 'support'].includes(userData?.role)

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
        { label: 'Client Identity', key: 'sender_name', render: (row) => (
            <div className="flex flex-col">
                <span className="font-black text-slate-800 tracking-tight">{row.sender_name || 'Guest'}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{row.sender_email || row.email}</span>
            </div>
        )},
        { label: 'Case Subject', key: 'subject', render: (row) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-600 truncate max-w-[250px]">{row.subject}</span>
                <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-md">#{row.ticket_id}</span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{row.category || 'General'}</span>
                </div>
            </div>
        )},
        { label: 'Priority', key: 'priority', render: (row) => (
            <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm
                ${row.priority === 'urgent' ? 'bg-red-500 text-white shadow-red-200' : 'bg-slate-100 text-slate-600'}`}>
                {row.priority}
            </span>
        )},
        { label: 'Assigned To', key: 'assigned_name', render: (row) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-600 text-xs">{row.assigned_name || 'Unassigned'}</span>
            </div>
        )},
        { label: 'Status', key: 'status', render: (row) => (
            <span className={`px-4 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm
                ${row.status === 'open' ? 'bg-emerald-500 text-white' : 
                  row.status === 'in_progress' ? 'bg-blue-500 text-white' : 
                  'bg-slate-50 text-slate-400'}`}>
                {row.status}
            </span>
        )},
    ]

    const actions = (row) => (
        <div className="flex gap-2">
            <button 
                onClick={() => router.push(`/dashboard/tickets/${row.ticket_id}`)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest group"
            >
                <RiMessage2Line size={16} className="group-hover:scale-110 transition-transform" /> Manage
            </button>
            {isStaff && (
                <button onClick={() => updateStatus(row.ticket_id, 'closed')} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-500 hover:border-emerald-100 transition-all group" title="Close Ticket">
                    <RiCheckboxCircleLine size={18} className="group-hover:scale-110 transition-transform" />
                </button>
            )}
        </div>
    )

    return (
        <div className="space-y-12 py-8 px-2">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-[0.3em]">
                        <RiShareForwardLine /> Active Tickets
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Support Threads</h1>
                    <p className="text-slate-500 font-bold opacity-70 max-w-md">Manage and respond to active client issues and escalations.</p>
                </div>
            </div>

            <div className="bg-white p-3 rounded-[3rem] border border-slate-50 shadow-sm overflow-hidden">
                <DataTable columns={columns} data={data} loading={loading} actions={actions} />
            </div>
        </div>
    )
}

export default GlobalTickets
