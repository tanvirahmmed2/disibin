'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DataTable from '@/component/dashboard/DataTable'
import { RiMessage2Line, RiShareForwardLine, RiCheckboxCircleLine } from 'react-icons/ri'

const SupportDashboard = () => {
    const [view, setView] = useState('tickets') 
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        setLoading(true)
        try {
            const endpoint = view === 'tickets' ? '/api/ticket' : '/api/support'
            const res = await axios.get(endpoint)
            setData(res.data.payload)
        } catch (error) {
            console.error('Failed to fetch data', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [view])

    const updateStatus = async (id, status) => {
        try {
            const endpoint = view === 'tickets' ? '/api/ticket' : '/api/support'
            await axios.patch(endpoint, { id, status })
            fetchData()
        } catch (error) {
            alert('Failed to update status')
        }
    }

    const columns = view === 'tickets' ? [
        { label: 'Client', key: 'senderId', render: (row) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-700">{row.senderId?.name || 'Guest'}</span>
                <span className="text-xs text-slate-400">{row.senderId?.email || row.email}</span>
            </div>
        )},
        { label: 'Subject', key: 'subject', render: (row) => (
            <div className="flex flex-col">
                <span className="font-medium text-slate-600 truncate max-w-[200px]">{row.subject}</span>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{row.category}</span>
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
                ${row.status === 'open' ? 'bg-amber-100 text-amber-700' : 
                  row.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 
                  'bg-emerald-100 text-emerald-700'}`}>
                {row.status}
            </span>
        )},
    ] : [
        { label: 'Guest', key: 'name', render: (row) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-700">{row.name}</span>
                <span className="text-xs text-slate-400">{row.email}</span>
            </div>
        )},
        { label: 'Subject', key: 'subject', render: (row) => (
            <p className="font-medium text-slate-600 truncate max-w-[200px]">{row.subject}</p>
        )},
        { label: 'Status', key: 'status', render: (row) => (
            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider
                ${row.status === 'open' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {row.status}
            </span>
        )},
    ]

    const actions = (row) => (
        <div className="flex gap-2">
            <button 
                onClick={() => {
                    const baseUrl = view === 'tickets' ? '/dashboard/tickets' : '/dashboard/support/messages'
                    window.location.href = `${baseUrl}/${row._id}`
                }}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-all font-bold text-xs flex items-center gap-1"
            >
                <RiMessage2Line size={18} /> {view === 'tickets' ? 'Chat' : 'Reply'}
            </button>
            {view === 'tickets' && (
                <button className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-all" title="Forward to PM">
                    <RiShareForwardLine size={18} />
                </button>
            )}
            {row.status !== 'closed' && (
                <button onClick={() => updateStatus(row._id, 'closed')} className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-all" title="Close">
                    <RiCheckboxCircleLine size={18} />
                </button>
            )}
        </div>
    )

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Support Management</h1>
                    <p className="text-slate-500">Respond to client tickets and general inquiries.</p>
                </div>
                <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-sm">
                    <button 
                        onClick={() => setView('tickets')}
                        className={`px-6 py-2 rounded-xl text-xs font-bold transition-all
                        ${view === 'tickets' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Client Tickets
                    </button>
                    <button 
                        onClick={() => setView('messages')}
                        className={`px-6 py-2 rounded-xl text-xs font-bold transition-all
                        ${view === 'messages' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Guest Messages
                    </button>
                </div>
            </div>

            <div className="bg-white p-2 rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
                <DataTable columns={columns} data={data} loading={loading} actions={actions} />
            </div>
        </div>
    )
}


export default SupportDashboard
