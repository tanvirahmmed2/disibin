'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import DataTable from '@/component/dashboard/DataTable'
import { RiServerLine, RiInformationLine, RiRefreshLine } from 'react-icons/ri'

const ManagerTenants = () => {
    const router = useRouter()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        setLoading(true)
        try {
            const res = await axios.get('/api/tenant')
            setData(res.data.data)
        } catch (error) {
            console.error('Failed to fetch tenants', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const columns = [
        {
            label: 'Tenant', key: 'name', render: (row) => (
                <div className="flex flex-col">
                    <span className="font-bold text-slate-900 uppercase tracking-tight text-xs">{row.name}</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">ID: {row.tenant_id}</span>
                </div>
            )
        },
        {
            label: 'Owner', key: 'owner', render: (row) => (
                <div className="flex flex-col">
                    <span className="font-bold text-slate-700 uppercase tracking-tight text-xs">{row.owner_name || 'N/A'}</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{row.owner_email}</span>
                </div>
            )
        },
        {
            label: 'Domain', key: 'domain', render: (row) => (
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-tight">{row.domain || row.subdomain || 'Not Configured'}</span>
            )
        },
        {
            label: 'Status', key: 'status', render: (row) => (
                <span className={`px-2 py-0.5 border text-[9px] font-bold uppercase tracking-widest
                ${row.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        row.status === 'suspended' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                            'bg-red-50 text-red-700 border-red-100'}`}>
                    {row.status}
                </span>
            )
        },
        {
            label: 'Expiry', key: 'expire_date', render: (row) => (
                <span className={`text-[10px] font-bold uppercase tracking-widest ${new Date(row.expire_date) < new Date() ? 'text-red-500' : 'text-slate-600'}`}>
                    {row.expire_date ? new Date(row.expire_date).toLocaleDateString() : 'N/A'}
                </span>
            )
        },
    ]

    const actions = (row) => (
        <button
            onClick={() => router.push(`/dashboard/manager/tenants/${row.tenant_id}`)}
            className="p-2 border border-slate-200 text-slate-400 hover:text-slate-800 transition-all"
            title="Manage"
        >
            <RiInformationLine size={16} />
        </button>
    )

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Workspaces</h1>
                    <p className="text-xs text-slate-500">Manage user workspaces, resources, and access statuses.</p>
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

export default ManagerTenants
