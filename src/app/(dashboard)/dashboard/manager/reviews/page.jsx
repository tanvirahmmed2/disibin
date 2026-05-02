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
                <span className="font-bold text-slate-900 uppercase tracking-tight text-xs">{row.user_name || 'User'}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{row.user_email}</span>
            </div>
        )},
        { label: 'Rating', key: 'rating', render: (row) => (
            <div className="flex items-center gap-0.5 text-slate-300">
                {[...Array(5)].map((_, i) => (
                    <RiStarFill key={i} size={12} className={i < (row.rating || 0) ? 'text-slate-800' : 'text-slate-200'} />
                ))}
            </div>
        )},
        { label: 'Comment', key: 'comment', render: (row) => (
            <p className="text-xs text-slate-600 font-bold uppercase tracking-tight max-w-[300px] truncate">&quot;{row.comment}&quot;</p>
        )},
        { label: 'Status', key: 'is_approved', render: (row) => (
            <span className={`px-2 py-0.5 border text-[9px] font-bold uppercase tracking-widest
                ${row.is_approved ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                {row.is_approved ? 'Approved' : 'Pending'}
            </span>
        )},
        { label: 'Posted', key: 'created_at', render: (row) => (
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(row.created_at).toLocaleDateString()}</span>
        )},
    ]

    const actions = (row) => (
        <div className="flex gap-1 items-center">
            {!row.is_approved && (
                <button 
                    onClick={() => handleApprove(row.review_id)}
                    className="px-2 py-1 bg-slate-900 text-white hover:bg-slate-800 transition-all font-bold text-[9px] uppercase tracking-widest"
                >
                    Approve
                </button>
            )}
            <button 
                onClick={() => handleDelete(row.review_id)}
                className="p-1.5 border border-slate-200 text-slate-400 hover:text-red-500 transition-all"
                title="Delete"
            >
                <RiDeleteBinLine size={16} />
            </button>
        </div>
    )

    return (
        <div className="space-y-4">
            <div className="border-b border-slate-200 pb-4">
                <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Reviews</h1>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">Moderate client feedback.</p>
            </div>

            <div className="bg-white border border-slate-200 overflow-hidden">
                <DataTable columns={columns} data={data} loading={loading} actions={actions} />
            </div>
        </div>
    )
}

export default ManagerReviews
