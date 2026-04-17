'use client'
import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import DataTable from '@/component/dashboard/DataTable'
import { Context } from '@/component/helper/Context'
import { RiDownloadCloud2Line, RiExternalLinkLine } from 'react-icons/ri'

const ClientPurchases = () => {
    const { isLoggedin } = useContext(Context)
    const [purchases, setPurchases] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchPurchases = async () => {
        if (!userData?._id) return;
        try {
            const res = await axios.get(`/api/purchase?userId=${userData._id}`, { withCredentials: true })
            if (res.data.success) {
                setPurchases(res.data.payload)
            }
        } catch (error) {
            console.error('Failed to fetch purchases', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (userData?._id) fetchPurchases()
    }, [userData])

    const columns = [
        { label: 'Purchased Item', key: 'title', render: (row) => (
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border
                        ${row.items?.[0]?.type === 'package' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                          row.items?.[0]?.type === 'membership' ? 'bg-purple-50 text-purple-600 border-purple-100' : 
                          'bg-amber-50 text-amber-600 border-amber-100'}`}>
                        {row.items?.[0]?.type || 'Standard'}
                    </span>
                    <span className="font-bold text-slate-700">{row.items?.[0]?.title || 'Mixed Bundle'}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono tracking-tight uppercase">ID: {row._id?.slice(-8)}</span>
            </div>
        )},
        { label: 'Amount', key: 'totalAmount', render: (row) => (
            <span className="font-black text-slate-900">BDT {row.totalAmount}</span>
        )},
        { label: 'Status', key: 'status', render: (row) => (
            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                ${row.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                  row.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                  'bg-rose-100 text-rose-700'}`}>
                {row.status}
            </span>
        )},
        { label: 'Date', key: 'createdAt', render: (row) => (
            <span className="text-slate-400 text-xs font-bold">{new Date(row.createdAt).toLocaleDateString('en-GB')}</span>
        )},
    ]

    const actions = (row) => (
        <div className="flex gap-2">
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-all">
                <RiExternalLinkLine size={18} title="View Subscription" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-all">
                <RiDownloadCloud2Line size={18} title="Download Invoice" />
            </button>
        </div>
    )

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Access & Purchases</h1>
                <p className="text-slate-500 font-medium">History of your acquired packages and account access status.</p>
            </div>

            <div className="bg-white p-2 rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
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
