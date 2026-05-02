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
            <span className="font-bold text-slate-900 text-[10px] uppercase tracking-widest">ORD-{row.purchase_id}</span>
        )},
        { label: 'Package', key: 'package_name', render: (row) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-900 text-xs uppercase tracking-tight leading-none mb-1">{row.package_name}</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                    {row.transaction_id ? `TXN: ${row.transaction_id}` : `ORD-${row.purchase_id}`}
                </span>
            </div>
        )},
        { label: 'Amount', key: 'final_amount', render: (row) => (
            <span className="font-bold text-slate-900 text-sm">৳{row.final_amount}</span>
        )},
        { label: 'Status', key: 'status', render: (row) => (
            <span className={`px-2 py-0.5 border text-[9px] font-bold uppercase tracking-widest
                ${row.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                {row.status}
            </span>
        )},
        { label: 'Date', key: 'created_at', render: (row) => (
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(row.created_at).toLocaleDateString()}</span>
        )},
    ]

    const actions = (row) => (
        <button className="p-1.5 border border-slate-200 text-slate-400 hover:text-slate-900 transition-all" title="Download">
            <RiDownload2Line size={16} />
        </button>
    )

    return (
        <div className="space-y-4">
            <div className="border-b border-slate-200 pb-4">
                <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Order History</h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Your previous transaction records.</p>
            </div>

            <div className="bg-white border border-slate-200 overflow-hidden">
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
