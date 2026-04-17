'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DataTable from '@/component/dashboard/DataTable'
import { RiStarFill, RiDeleteBinLine } from 'react-icons/ri'

const ManagerReviews = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        try {
            const res = await axios.get('/api/review')
            setData(res.data.payload)
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
            fetchData()
        } catch (error) {
            alert('Failed to delete review')
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const columns = [
        { label: 'Client', key: 'user', render: (row) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-700">{row.user?.name || 'User'}</span>
                <span className="text-xs text-slate-400">{row.user?.email}</span>
            </div>
        )},
        { label: 'Rating', key: 'rating', render: (row) => (
            <div className="flex items-center gap-1 text-amber-500">
                {[...Array(row.rating)].map((_, i) => <RiStarFill key={i} size={14} />)}
            </div>
        )},
        { label: 'Comment', key: 'comment', render: (row) => (
            <p className="text-xs text-slate-500 italic truncate max-w-[300px] font-medium">"{row.comment}"</p>
        )},
        { label: 'Date', key: 'createdAt', render: (row) => (
            <span className="text-xs text-slate-400 font-bold">{new Date(row.createdAt).toLocaleDateString()}</span>
        )},
    ]

    const actions = (row) => (
        <button 
            onClick={() => handleDelete(row._id)}
            className="p-2 hover:bg-rose-50 text-rose-500 rounded-lg transition-all"
            title="Delete Review"
        >
            <RiDeleteBinLine size={18} />
        </button>
    )

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Review Oversight</h1>
                <p className="text-slate-500 font-medium">Monitor and manage client feedback across the platform.</p>
            </div>

            <div className="bg-white p-2 rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
                <DataTable columns={columns} data={data} loading={loading} actions={actions} />
            </div>
        </div>
    )
}

export default ManagerReviews
