'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DataTable from '@/component/dashboard/DataTable'
import { RiMoneyDollarCircleLine, RiInformationLine, RiCheckLine, RiCloseLine, RiRefreshLine } from 'react-icons/ri'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const ManagerPurchases = () => {
    const router= useRouter()
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

    const handleReject = async (purchaseId) => {
        if (!window.confirm('Are you sure you want to reject this purchase request?')) return
        setProcessing(purchaseId)
        try {
            const res = await axios.patch('/api/purchase', { id: purchaseId, status: 'rejected' })
            if (res.data.success) {
                toast.success('Purchase rejected and payment marked as failed.')
                fetchData()
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reject purchase')
        } finally {
            setProcessing(null)
        }
    }

    const handleSuspend = async (purchaseId, currentStatus) => {
        const newStatus = currentStatus === 'suspended' ? 'approved' : 'suspended'
        if (!window.confirm(`Are you sure you want to ${newStatus === 'suspended' ? 'SUSPEND' : 'ACTIVATE'} this service?`)) return
        setProcessing(purchaseId)
        try {
            const res = await axios.patch('/api/purchase', { id: purchaseId, status: newStatus })
            if (res.data.success) {
                toast.success(`Service ${newStatus === 'suspended' ? 'suspended' : 'activated'}!`)
                fetchData()
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update status')
        } finally {
            setProcessing(null)
        }
    }

    const handleRefund = async (purchaseId) => {
        if (!window.confirm('Are you sure you want to REFUND this purchase? This will suspend services.')) return
        setProcessing(purchaseId)
        try {
            const res = await axios.patch('/api/purchase', { id: purchaseId, status: 'refunded' })
            if (res.data.success) {
                toast.success('Purchase refunded and service canceled.')
                fetchData()
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to refund')
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
        { label: 'ID', key: 'purchase_id', render: (row) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">#{row.purchase_id}</span>
                {row.transaction_id && <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-600">TXN: {row.transaction_id}</span>}
            </div>
        )},
        { label: 'User', key: 'user', render: (row) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-900 uppercase tracking-tight text-xs">{row.user_name || 'User'}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{row.user_email}</span>
            </div>
        )},
        { label: 'Package', key: 'package', render: (row) => (
            <div className="flex flex-col">
                <span className="font-bold text-emerald-600 uppercase tracking-tight text-xs">{row.package_name || 'Unknown Package'}</span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">PKID: {row.package_id}</span>
            </div>
        )},
        { label: 'Amount', key: 'final_amount', render: (row) => (
            <div className="flex flex-col">
                <div className="font-bold text-slate-900 text-sm uppercase tracking-tighter">
                    ৳{row.final_amount}
                </div>
                {row.discount_amount > 0 && (
                    <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">SAVE ৳{row.discount_amount}</span>
                )}
            </div>
        )},
        { label: 'Status', key: 'status', render: (row) => (
            <span className={`px-2 py-0.5 border text-[9px] font-bold uppercase tracking-widest inline-block
                ${row.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                  row.status === 'approved' || row.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                  row.status === 'suspended' ? 'bg-red-50 text-red-700 border-red-100' :
                  'bg-slate-50 text-slate-700 border-slate-200'}`}>
                {row.status}
            </span>
        )},
        { label: 'Date', key: 'created_at', render: (row) => (
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(row.created_at).toLocaleDateString()}</span>
        )},
    ]

    const actions = (row) => (
        <div className="flex gap-1 items-center">
            {row.status === 'pending' && (
                <>
                    <button
                        onClick={() => handleConfirm(row.purchase_id)}
                        disabled={processing === row.purchase_id}
                        className="px-3 py-1.5 bg-slate-900 text-white text-[9px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50"
                    >
                        Accept
                    </button>
                    <button
                        onClick={() => handleReject(row.purchase_id)}
                        disabled={processing === row.purchase_id}
                        className="px-3 py-1.5 border border-slate-200 text-slate-600 text-[9px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all disabled:opacity-50"
                    >
                        Reject
                    </button>
                </>
            )}
            {(row.status === 'approved' || row.status === 'completed' || row.status === 'suspended') && (
                <>
                    <button
                        onClick={() => handleRefund(row.purchase_id)}
                        disabled={processing === row.purchase_id}
                        className="px-3 py-1.5 border border-slate-200 text-slate-600 text-[9px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all disabled:opacity-50"
                    >
                        Refund
                    </button>
                    <button
                        onClick={() => handleSuspend(row.purchase_id, row.status)}
                        disabled={processing === row.purchase_id}
                        className={`px-3 py-1.5 border text-[9px] font-bold uppercase tracking-widest transition-all disabled:opacity-50
                            ${row.status === 'suspended' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}
                    >
                        {row.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
                    </button>
                </>
            )}
            {(row.status === 'pending' || row.status === 'rejected' || row.status === 'refunded' || row.status === 'suspended') && (
                <button
                    onClick={() => handleDelete(row.purchase_id)}
                    disabled={processing === row.purchase_id}
                    className="p-1.5 border border-slate-200 text-slate-400 hover:text-red-500 transition-all disabled:opacity-50"
                    title="Delete"
                >
                    <RiCloseLine size={16} />
                </button>
            )}
            <button 
                onClick={() => router.push(`/dashboard/manager/subscriptions/${row.purchase_id}`)}
                className="p-1.5 border border-slate-200 text-slate-400 hover:text-slate-800 transition-all" 
                title="Details"
            >
                <RiInformationLine size={16} />
            </button>
        </div>
    )

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Purchases</h1>
                    <p className="text-xs text-slate-500">Review pending orders and activate subscriptions.</p>
                </div>
                <button 
                    onClick={fetchData} 
                    className="p-2 border border-slate-200 text-slate-500 hover:text-slate-800 transition-all"
                >
                    <RiRefreshLine size={18} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            <div className="bg-white border border-slate-200 overflow-hidden">
                <DataTable columns={columns} data={data} loading={loading} actions={actions} />
            </div>
        </div>
    )
}

export default ManagerPurchases
