'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import DataTable from '@/component/dashboard/DataTable'
import { RiMessage2Line, RiCheckboxCircleLine } from 'react-icons/ri'

const GuestMessages = () => {
    const router = useRouter()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        setLoading(true)
        try {
            const res = await axios.get('/api/support')
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
            await axios.patch('/api/support', { id, status })
            fetchData()
        } catch (error) {
            alert('Failed to update status')
        }
    }

    const columns = [
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
                ${row.status === 'open' ? 'bg-white text-white' : 'bg-primary/10 text-primary'}`}>
                {row.status}
            </span>
        )},
    ]

    const actions = (row) => (
        <div className="flex gap-2">
            <button 
                onClick={() => router.push(`/dashboard/support/messages/${row._id}`)}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-all font-bold text-xs flex items-center gap-1"
            >
                <RiMessage2Line size={18} /> Reply
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
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Guest Messages</h1>
                <p className="text-slate-500">Respond to general inquiries from potential clients via Brevo email.</p>
            </div>

            <div className="bg-white p-2 rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
                <DataTable columns={columns} data={data} loading={loading} actions={actions} />
            </div>
        </div>
    )
}

export default GuestMessages
