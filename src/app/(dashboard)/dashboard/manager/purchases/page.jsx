'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DataTable from '@/component/dashboard/DataTable'
import { RiMoneyDollarCircleLine, RiInformationLine } from 'react-icons/ri'

const ManagerPurchases = () => {
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
        { label: 'User', key: 'user', render: (row) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-700">{row.user_name || 'User'}</span>
                <span className="text-xs text-slate-400">{row.user_email}</span>
            </div>
        )},
        { label: 'Package', key: 'package', render: (row) => (
            <div className="flex flex-col">
                <span className="font-bold text-primary">{row.package_name || 'Unknown Package'}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">ID: {row.package_id?.slice(-6) || 'N/A'}</span>
            </div>
        )},
        { label: 'Revenue', key: 'final_amount', render: (row) => (
            <div className="flex items-center gap-1 font-black text-slate-900 text-lg">
                <span className="text-emerald-500/50">৳</span>{row.final_amount}
            </div>
        )},
        { label: 'Status', key: 'status', render: (row) => (
            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary-dark`}>
                {row.status}
            </span>
        )},
        { label: 'Date', key: 'created_at', render: (row) => (
            <span className="text-xs text-slate-400 font-bold">{new Date(row.created_at).toLocaleDateString()}</span>
        )},
    ]

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Sales Oversight</h1>
                <p className="text-slate-500 font-medium">Monitor all successful package transactions across the platform.</p>
            </div>

            <div className="bg-white p-2 rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
                <DataTable columns={columns} data={data} loading={loading} />
            </div>
        </div>
    )
}

export default ManagerPurchases
