'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DataTable from '@/component/dashboard/DataTable'
import { RiMoneyDollarCircleLine, RiInformationLine, RiCheckLine, RiCloseLine, RiRefreshLine } from 'react-icons/ri'
import toast from 'react-hot-toast'

const ManagerPurchases = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState(null)

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

    const handleConfirm = async (purchaseId) => {
        if (!window.confirm('Are you sure you want to approve this purchase and activate services?')) return
        setProcessing(purchaseId)
        try {
            const res = await axios.post('/api/purchase/confirm', { purchaseId })
            if (res.data.success) {
                toast.success('Purchase approved and service activated!')
                fetchData()
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to approve purchase')
        } finally {
            setProcessing(null)
        }
    }

    const handleDelete = async (purchaseId) => {
        if (!window.confirm('Are you sure you want to delete this purchase request? This action cannot be undone.')) return
        setProcessing(purchaseId)
        try {
            const res = await axios.delete('/api/purchase', { data: { id: purchaseId } })
            if (res.data.success) {
                toast.success('Purchase request deleted successfully')
                fetchData()
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete purchase')
        } finally {
            setProcessing(null)
        }
    }

    const columns = [
        { label: 'Purchase ID', key: 'purchase_id', render: (row) => (
            <div className="flex flex-col">
                <span className="font-mono text-[10px] font-bold text-slate-400">#{row.purchase_id}</span>
                {row.transaction_id && <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">TXN: {row.transaction_id}</span>}
            </div>
        )},
        { label: 'User', key: 'user', render: (row) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-700">{row.user_name || 'User'}</span>
                <span className="text-xs text-slate-400">{row.user_email}</span>
            </div>
        )},
        { label: 'Package', key: 'package', render: (row) => (
            <div className="flex flex-col">
                <span className="font-bold text-emerald-600">{row.package_name || 'Unknown Package'}</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Package ID: {row.package_id}</span>
            </div>
        )},
        { label: 'Amount', key: 'final_amount', render: (row) => (
            <div className="flex flex-col">
                <div className="flex items-center gap-1 font-black text-slate-900 text-base">
                    <span className="text-emerald-500/50">৳</span>{row.final_amount}
                </div>
                {row.discount_amount > 0 && (
                    <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">Saved ৳{row.discount_amount}</span>
                )}
            </div>
        )},
        { label: 'Status', key: 'status', render: (row) => (
            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest inline-block
                ${row.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                  row.status === 'approved' || row.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                  'bg-red-100 text-red-700'}`}>
                {row.status}
            </span>
        )},
        { label: 'Date', key: 'created_at', render: (row) => (
            <span className="text-[10px] text-slate-400 font-bold">{new Date(row.created_at).toLocaleString()}</span>
        )},
    ]

    const actions = (row) => (
        <div className="flex gap-2">
            {row.status === 'pending' && (
                <>
                    <button
                        onClick={() => handleConfirm(row.purchase_id)}
                        disabled={processing === row.purchase_id}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                    >
                        {processing === row.purchase_id ? <RiRefreshLine className="animate-spin" size={14} /> : <RiCheckLine size={14} />}
                        Confirm
                    </button>
                    <button
                        onClick={() => handleDelete(row.purchase_id)}
                        disabled={processing === row.purchase_id}
                        className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                    >
                        {processing === row.purchase_id ? <RiRefreshLine className="animate-spin" size={14} /> : <RiCloseLine size={14} />}
                        Delete
                    </button>
                </>
            )}
            <button className="p-2 hover:bg-slate-100 text-slate-400 rounded-lg transition-all" title="View Details">
                <RiInformationLine size={18} />
            </button>
        </div>
    )

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Purchase Management</h1>
                    <p className="text-slate-500 font-medium">Review pending orders and activate subscriptions for users.</p>
                </div>
                <button onClick={fetchData} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-emerald-500 hover:border-emerald-500/10 transition-all shadow-sm">
                    <RiRefreshLine size={20} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            <div className="bg-white p-2 rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
                <DataTable columns={columns} data={data} loading={loading} actions={actions} />
            </div>
        </div>
    )
}

export default ManagerPurchases
