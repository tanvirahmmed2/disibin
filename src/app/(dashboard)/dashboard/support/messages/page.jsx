'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import DataTable from '@/component/dashboard/DataTable'
import { RiMessage2Line, RiCheckboxCircleLine } from 'react-icons/ri'
import Link from 'next/link'
import { MdDeleteOutline } from 'react-icons/md'

const GuestMessages = () => {
    const router = useRouter()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        setLoading(true)
        try {
            const res = await axios.get('/api/support')
            setData(res.data.data|| [])
        } catch (error) {
            console.error('Failed to fetch data', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])



    

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Guest Messages</h1>
                <p className="text-slate-500">Respond to general inquiries from potential clients via Brevo email.</p>
            </div>
            {
    data.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-slate-500 font-medium italic">No messages found in your inbox</p>
        </div>
    ) : (
        <div className="w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">

            <div className="grid grid-cols-4 bg-slate-50 border-b border-slate-200 px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600">
                <span className="text-left">Sender</span>
                <span className="text-center">Subject</span>
                <span className="text-center">Status</span>
                <span className="text-right">Action</span>
            </div>

            <div className="flex flex-col">
                {data.map((sup) => (
                    <div 
                        key={sup.support_id} 
                        className="grid grid-cols-4 items-center px-6 py-4 border-b border-slate-100 last:border-none hover:bg-slate-50/80 transition-colors"
                    >
                        <div className="flex flex-col items-start gap-0.5">
                            <span className="text-sm font-semibold text-slate-800">{sup.name}</span>
                            <span className="text-xs text-slate-500">{sup.email}</span>
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-slate-600 truncate px-2">{sup.subject}</p>
                        </div>

                        <div className="flex justify-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                                sup.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                                sup.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 
                                'bg-slate-100 text-slate-600'
                            }`}>
                                {sup.status}
                            </span>
                        </div>

                        <div className="flex flex-row gap-3 justify-end items-center">
                            <Link 
                                href={`/dashboard/support/messages/${sup.support_id}`}
                                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-all"
                            >
                                Reply
                            </Link>
                            <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all active:scale-90">
                                <MdDeleteOutline size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
            
        </div>
    )
}

export default GuestMessages
