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
            setData(res.data.payload)
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
        { label: 'Client', key: 'user', render: (row) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-700">{row.user?.name || 'User'}</span>
                <span className="text-xs text-slate-400">{row.user?.email}</span>
            </div>
        )},
        { label: 'Package Purchased', key: 'package', render: (row) => (
            <div className="flex flex-col">
                <span className="font-bold text-primary">{row.package?.title}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">ID: {row.package?._id}</span>
            </div>
        )},
        { label: 'Revenue', key: 'price', render: (row) => (
            <div className="flex items-center gap-1 font-black text-slate-700 text-lg">
                <span className="text-emerald-500">$</span>{row.price}
            </div>
        )},
        { label: 'Date', key: 'createdAt', render: (row) => (
            <span className="text-xs text-slate-400 font-bold">{new Date(row.createdAt).toLocaleDateString()}</span>
        )},
    ]

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Global Financial Oversight</h1>
                <p className="text-slate-500 font-medium">Detailed log of all platform revenue-generating package sales.</p>
            </div>

            <div className="bg-white p-2 rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
                <DataTable columns={columns} data={data} loading={loading} />
            </div>
        </div>
    )
}

export default AdminPurchases
