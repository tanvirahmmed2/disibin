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
        { label: 'Tenant', key: 'name', render: (row) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-800">{row.name}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: {row.tenant_id}</span>
            </div>
        )},
        { label: 'Owner', key: 'owner', render: (row) => (
            <div className="flex flex-col">
                <span className="font-semibold text-slate-700">{row.owner_name || 'N/A'}</span>
                <span className="text-xs text-slate-500">{row.owner_email}</span>
            </div>
        )},
        { label: 'Domain', key: 'domain', render: (row) => (
            <span className="text-sm font-semibold text-emerald-600">{row.domain || row.subdomain || 'Not Configured'}</span>
        )},
        { label: 'Status', key: 'status', render: (row) => (
            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider
                ${row.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 
                  row.status === 'suspended' ? 'bg-amber-50 text-amber-600' : 
                  'bg-red-50 text-red-500'}`}>
                {row.status}
            </span>
        )},
        { label: 'Created', key: 'created_at', render: (row) => (
            <span className="text-slate-500 text-xs font-semibold">{new Date(row.created_at).toLocaleDateString()}</span>
        )},
    ]

    const actions = (row) => (
        <button 
            onClick={() => router.push(`/dashboard/manager/tenants/${row.tenant_id}`)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-emerald-500 transition-all"
            title="Manage Tenant"
        >
            <RiInformationLine size={18} />
        </button>
    )

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Tenants & Workspaces</h1>
                    <p className="text-slate-500 font-medium">Manage user workspaces, resources, and access statuses.</p>
                </div>
                <button 
                    onClick={fetchData} 
                    className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-emerald-500 hover:border-emerald-500/10 transition-all shadow-sm"
                >
                    <RiRefreshLine size={20} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            <div className="bg-white p-2 rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
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
