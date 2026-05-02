'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import DataTable from '@/component/dashboard/DataTable'
import { RiShieldFlashLine, RiInformationLine, RiRefreshLine, RiDeleteBinLine, RiPauseCircleLine, RiPlayCircleLine } from 'react-icons/ri'
import toast from 'react-hot-toast'

const ManagerSubscriptions = () => {
    const router = useRouter()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        setLoading(true)
        try {
            const res = await axios.get('/api/subscription?all=true')
            setData(res.data.data)
        } catch (error) {
            console.error('Failed to fetch subscriptions', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleStatusChange = async (id, newStatus) => {
        if (!window.confirm(`Are you sure you want to change status to ${newStatus}?`)) return
        try {
            const res = await axios.patch('/api/subscription', { id, status: newStatus })
            if (res.data.success) {
                toast.success(`Subscription marked as ${newStatus}`)
                fetchData()
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update status')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this subscription?')) return
        try {
            const res = await axios.delete('/api/subscription', { data: { id } })
            if (res.data.success) {
                toast.success('Subscription deleted')
                fetchData()
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete subscription')
        }
    }

    const columns = [
        {
            label: 'Customer', key: 'user', render: (row) => (
                <div className="flex flex-col">
                    <span className="font-bold text-slate-900 uppercase tracking-tight text-xs">{row.user_name || 'N/A'}</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{row.user_email}</span>
                </div>
            )
        },
        {
            label: 'Package', key: 'package_name', render: (row) => (
                <div className="flex flex-col">
                    <span className="font-bold text-slate-700 uppercase tracking-tight text-xs">{row.package_name || 'Custom'}</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">ID: {row.subscription_id}</span>
                </div>
            )
        },
        {
            label: 'Status', key: 'status', render: (row) => (
                <span className={`px-2 py-0.5 border text-[9px] font-bold uppercase tracking-widest
                ${row.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        row.status === 'suspended' || row.status === 'past_due' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                            'bg-red-50 text-red-700 border-red-100'}`}>
                    {row.status}
                </span>
            )
        },
        {
            label: 'Expiry', key: 'current_period_end', render: (row) => {
                if (!row.current_period_end) return <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Lifetime</span>
                const isExpired = new Date(row.current_period_end) < new Date()
                return (
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isExpired ? 'text-red-500' : 'text-slate-600'}`}>
                        {new Date(row.current_period_end).toLocaleDateString()}
                    </span>
                )
            }
        },
        {
            label: 'Created', key: 'created_at', render: (row) => (
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{new Date(row.created_at).toLocaleDateString()}</span>
            )
        },
    ]

    const actions = (row) => (
        <div className="flex items-center gap-1">
            <button
                onClick={() => handleStatusChange(row.subscription_id, row.status === 'active' ? 'suspended' : 'active')}
                className={`p-2 border transition-all ${row.status === 'active' ? 'text-amber-500 border-slate-200 hover:border-amber-200 hover:bg-amber-50' : 'text-emerald-500 border-slate-200 hover:border-emerald-200 hover:bg-emerald-50'}`}
                title={row.status === 'active' ? 'Pause' : 'Activate'}
            >
                {row.status === 'active' ? <RiPauseCircleLine size={16} /> : <RiPlayCircleLine size={16} />}
            </button>
            <button
                onClick={() => router.push(`/dashboard/manager/subscriptions/${row.subscription_id}`)}
                className="p-2 border border-slate-200 text-slate-400 hover:text-slate-800 transition-all"
                title="Details"
            >
                <RiInformationLine size={16} />
            </button>
            {row.status === 'refunded' && (
                <button
                    onClick={() => handleDelete(row.subscription_id)}
                    className="p-2 border border-slate-200 text-slate-400 hover:text-red-500 transition-all"
                    title="Delete"
                >
                    <RiDeleteBinLine size={16} />
                </button>
            )}
        </div>
    )

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Subscriptions</h1>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Manage active user plans.</p>
                </div>
                <button
                    onClick={fetchData}
                    className="p-2 border border-slate-200 text-slate-400 hover:text-slate-800 transition-all"
                >
                    <RiRefreshLine size={16} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            <div className="bg-white border border-slate-200 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={data}
                    loading={loading}
                    actions={actions}
                />
            </div>
        </div>
    )
}

export default ManagerSubscriptions
