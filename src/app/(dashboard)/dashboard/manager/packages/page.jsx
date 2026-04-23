'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DataTable from '@/component/dashboard/DataTable'
import { RiAddLine, } from 'react-icons/ri'
import { MdDeleteOutline, MdEditDocument } from 'react-icons/md'
import toast from 'react-hot-toast'

const EditorPackages = () => {
    const router = useRouter()
    const [packages, setPackages] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchPackages = async () => {
        setLoading(true)
        try {
            const res = await axios.get('/api/package')
            setPackages(res.data.data || [])
        } catch (error) {
            console.error('Failed to fetch packages', error)
            toast.error('Failed to load packages')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this package?')) return
        try {
            await axios.delete('/api/package', { data: { id } })
            toast.success('Package deleted')
            fetchPackages()
        } catch (error) {
            toast.error('Failed to delete package')
        }
    }

    useEffect(() => {
        fetchPackages()
    }, [])

    const columns = [
        { label: 'Package Name', key: 'name', render: (row) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-800">{row.name}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{row.category_name || 'General'}</span>
            </div>
        )},
        { label: 'Investment', key: 'price', render: (row) => (
            <span className="font-bold text-slate-600">৳{row.price}</span>
        )},
        { label: 'Duration', key: 'duration_days', render: (row) => (
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{row.duration_days} Days</span>
        )},
    ]

    const actions = (row) => (
        <div className="flex gap-2">
            <Link 
                href={`/dashboard/manager/packages/${row.slug}`}
                className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-all"
            >
                <MdEditDocument size={20} />
            </Link>
            <button 
                onClick={() => handleDelete(row.package_id)}
                className="p-2 hover:bg-slate-100 text-slate-400 hover:text-red-500 rounded-lg transition-all"
            >
                <MdDeleteOutline size={20} />
            </button>
        </div>
    )

    return (
        <div className="space-y-6 py-6 px-4">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-slate-800">Catalog Packages</h1>
                    <p className="text-sm text-slate-500">Manage and refine the list of commercial offerings.</p>
                </div>
                <Link href="/dashboard/manager/packages/new" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg shadow-slate-900/10 flex items-center gap-2">
                    <RiAddLine size={18} /> Create Package
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <DataTable columns={columns} data={packages} loading={loading} actions={actions} />
            </div>
        </div>
    )
}

export default EditorPackages
