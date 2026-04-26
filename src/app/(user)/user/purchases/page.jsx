'use client'
import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import DataTable from '@/component/dashboard/DataTable'
import { Context } from '@/component/helper/Context'
import { RiFileList3Line, RiDownload2Line, RiPriceTag3Line } from 'react-icons/ri'

const ClientPurchases = () => {
    const { isLoggedIn } = useContext(Context)
    const [purchases, setPurchases] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchPurchases = async () => {
        try {
            const res = await axios.get('/api/purchase?personal=true', { withCredentials: true })
            setPurchases(res.data.data)
        } catch (error) {
            console.error('Failed to fetch purchases', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isLoggedIn) fetchPurchases()
    }, [isLoggedIn])

    const columns = [
        { label: 'Order ID', key: 'purchase_id', render: (row) => (
            <span className="font-bold text-slate-800 text-xs">ORD-{row.purchase_id}</span>
        )},
        { label: 'Asset', key: 'package_name', render: (row) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-700">{row.package_name}</span>
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
                    {row.transaction_id ? `TXN: ${row.transaction_id}` : `ORD-${row.purchase_id}`}
                </span>
            </div>
        )},
        { label: 'Amount', key: 'final_amount', render: (row) => (
            <span className="font-bold text-emerald-600">৳{row.final_amount}</span>
        )},
        { label: 'Status', key: 'status', render: (row) => (
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                ${row.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                {row.status}
            </span>
        )},
        { label: 'Date', key: 'created_at', render: (row) => (
            <span className="text-slate-500 text-xs">{new Date(row.created_at).toLocaleDateString()}</span>
        )},
    ]

    const actions = (row) => (
        <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-emerald-500 transition-all">
            <RiDownload2Line size={18} />
        </button>
    )

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Order History</h1>
                <p className="text-slate-500 text-sm">View and manage your previous transaction records.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <DataTable 
                    columns={columns} 
                    data={purchases} 
                    loading={loading} 
                    actions={actions} 
                />
            </div>
        </div>
    )
}

export default ClientPurchases
