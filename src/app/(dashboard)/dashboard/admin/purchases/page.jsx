'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DataTable from '@/component/dashboard/DataTable'
import { RiMoneyDollarCircleLine } from 'react-icons/ri'

const AdminPurchases = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        try {
            const res = await axios.get('/api/purchase')
            setData(res.data.data)
        } catch (error) {
            console.error('Failed to fetch purchases', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const columns = [
        { label: 'User', key: 'user_name', render: (row) => (
            <div className="flex items-center gap-3">
                <div className="w-6 h-6 border border-slate-200 bg-slate-50 flex items-center justify-center text-[9px] font-bold text-slate-500 uppercase shrink-0">
                    {(row.user_name || 'U').charAt(0)}
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="font-bold text-slate-900 text-[10px] uppercase tracking-tight truncate">{row.user_name || 'User'}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">{row.user_email}</span>
                </div>
            </div>
        )},
        { label: 'Package', key: 'package_name', render: (row) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-900 text-[10px] uppercase tracking-tight">{row.package_name || 'Unknown Package'}</span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">ID #{row.package_id || 'N/A'}</span>
            </div>
        )},
        { label: 'Amount', key: 'final_amount', render: (row) => (
            <span className="font-bold text-slate-900 text-sm">৳{Number(row.final_amount || 0).toLocaleString()}</span>
        )},
        { label: 'Date', key: 'created_at', render: (row) => (
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                {new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
        )},
    ]

    return (
        <div className="space-y-4">
            <div className="border-b border-slate-200 pb-4">
                <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Purchase History</h1>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Global log of all platform revenue-generating package sales.</p>
            </div>

            <div className="bg-white border border-slate-200 overflow-hidden">
                <DataTable columns={columns} data={data} loading={loading} />
            </div>
        </div>
    )
}

export default AdminPurchases
