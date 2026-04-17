'use client'
import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import DataTable from '@/component/dashboard/DataTable'
import { Context } from '@/component/helper/Context'
import { RiStarFill, RiEdit2Line, RiDeleteBin6Line } from 'react-icons/ri'

const ClientReviews = () => {
    const { isLoggedin } = useContext(Context)
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchReviews = async () => {
        try {
            const res = await axios.get('/api/user/review', { withCredentials: true })
            setReviews(res.data.data)
        } catch (error) {
            console.error('Failed to fetch reviews', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isLoggedin) fetchReviews()
    }, [isLoggedin])

    const columns = [
        { label: 'Rating', key: 'rate', render: (row) => (
            <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <RiStarFill key={i} className={i < row.rate ? 'text-white' : 'text-slate-200'} size={14} />
                ))}
            </div>
        )},
        { label: 'Comment', key: 'comment', render: (row) => (
            <p className="text-slate-600 max-w-xs truncate">{row.comment}</p>
        )},
        { label: 'Status', key: 'isApproved', render: (row) => (
            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                ${row.isApproved ? 'bg-primary/10 text-primary-dark' : 'bg-white text-white'}`}>
                {row.isApproved ? 'Approved' : 'Pending'}
            </span>
        )},
    ]

    const actions = (row) => (
        <div className="flex gap-2">
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-all">
                <RiEdit2Line size={18} />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg text-red-500 transition-all">
                <RiDeleteBin6Line size={18} />
            </button>
        </div>
    )

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">System Feedback</h1>
                    <p className="text-slate-500 font-medium">Manage your reviews and personal feedback for services used.</p>
                </div>
                <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-slate-900/10 hover:bg-primary transition-all active:scale-95">
                    Compose Review
                </button>
            </div>

            <div className="bg-white p-2 rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
                <DataTable 
                    columns={columns} 
                    data={reviews} 
                    loading={loading} 
                    actions={actions} 
                />
            </div>
        </div>
    )
}

export default ClientReviews
