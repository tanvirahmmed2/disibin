'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DataTable from '@/component/dashboard/DataTable'
import { RiStarFill, RiDeleteBinLine, RiCheckLine, RiFeedbackLine } from 'react-icons/ri'
import toast from 'react-hot-toast'

const ManagerReviews = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        try {
            const res = await axios.get('/api/review')
            setData(res.data.data)
        } catch (error) {
            console.error('Failed to fetch reviews', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Remove this review?')) return
        try {
            await axios.delete(`/api/review?id=${id}`)
            toast.success('Review deleted.')
            fetchData()
        } catch (error) {
            toast.error('Failed to delete review')
        }
    }

    const handleApprove = async (id) => {
        try {
            await axios.patch('/api/review', { id, isApproved: true });
            toast.success('Review approved.')
            fetchData();
        } catch (error) {
            toast.error('Failed to approve review')
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const columns = [
        { label: 'Client', key: 'user_name', render: (row) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-800">{row.user_name || 'User'}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{row.user_email}</span>
            </div>
        )},
        { label: 'Rating', key: 'rating', render: (row) => (
            <div className="flex items-center gap-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                    <RiStarFill key={i} size={14} className={i < (row.rating || 0) ? 'text-yellow-400' : 'text-slate-100'} />
                ))}
            </div>
        )},
        { label: 'Comment', key: 'comment', render: (row) => (
            <p className="text-sm text-slate-600 font-medium italic leading-relaxed max-w-[300px] truncate">"{row.comment}"</p>
        )},
        { label: 'Status', key: 'is_approved', render: (row) => (
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                ${row.is_approved ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-400'}`}>
                {row.is_approved ? 'Approved' : 'Pending'}
            </span>
        )},
        { label: 'Posted', key: 'created_at', render: (row) => (
            <span className="text-xs text-slate-500 font-medium">{new Date(row.created_at).toLocaleDateString()}</span>
        )},
    ]

    const actions = (row) => (
        <div className="flex gap-2">
            {!row.is_approved && (
                <button 
                    onClick={() => handleApprove(row.review_id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-500 hover:text-white transition-all font-bold text-[10px] uppercase tracking-wider"
                >
                    <RiCheckLine size={14} /> Approve
                </button>
            )}
            <button 
                onClick={() => handleDelete(row.review_id)}
                className="p-2 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-lg transition-all"
                title="Delete Review"
            >
                <RiDeleteBinLine size={18} />
            </button>
        </div>
    )

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-emerald-500 font-bold text-[10px] uppercase tracking-widest">
                    <RiFeedbackLine /> Reputation Management
                </div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Review Moderation</h1>
                <p className="text-slate-500 text-sm">Monitor and moderate client feedback submitted to the platform.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <DataTable columns={columns} data={data} loading={loading} actions={actions} />
            </div>
        </div>
    )
}

export default ManagerReviews
