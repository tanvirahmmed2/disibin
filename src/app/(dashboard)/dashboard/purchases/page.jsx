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
        try {
            const res = await axios.get('/api/user/purchased_packages', { withCredentials: true })
            setPurchases(res.data.payload)
        } catch (error) {
            console.error('Failed to fetch purchases', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isLoggedin) fetchPurchases()
    }, [isLoggedin])

    const columns = [
        { label: 'Package', key: 'title', render: (row) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-700">{row.title}</span>
                <span className="text-[10px] text-slate-400 font-mono tracking-tight uppercase">{row._id?.slice(-8)}</span>
            </div>
        )},
        { label: 'Status', key: 'status', render: (row) => (
            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                ${row.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {row.status}
            </span>
        )},
        { label: 'Date', key: 'createdAt', render: (row) => (
            <span className="text-slate-400">{new Date(row.createdAt).toLocaleDateString()}</span>
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
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Access & Purchases</h1>
                <p className="text-slate-500">History of your acquired packages and access status.</p>
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
