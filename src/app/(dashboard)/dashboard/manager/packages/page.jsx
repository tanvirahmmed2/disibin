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
        { label: 'Package', key: 'name', render: (row) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-900 uppercase tracking-tight text-xs leading-none mb-1">{row.name}</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">{row.category_name || 'General'}</span>
            </div>
        )},
        { label: 'Price', key: 'price', render: (row) => (
            <span className="font-bold text-slate-700 text-sm uppercase tracking-tighter">৳{row.price}</span>
        )},
        { label: 'Duration', key: 'duration_days', render: (row) => (
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{row.duration_days} Days</span>
        )},
    ]

    const actions = (row) => (
        <div className="flex gap-1">
            <Link 
                href={`/dashboard/manager/packages/${row.slug}`}
                className="p-2 border border-slate-200 text-slate-400 hover:text-slate-800 transition-all"
                title="Edit"
            >
                <MdEditDocument size={16} />
            </Link>
            <button 
                onClick={() => handleDelete(row.package_id)}
                className="p-2 border border-slate-200 text-slate-400 hover:text-red-500 transition-all"
                title="Delete"
            >
                <MdDeleteOutline size={16} />
            </button>
        </div>
    )

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="space-y-1">
                    <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Packages</h1>
                    <p className="text-xs text-slate-500">Manage and refine the list of commercial offerings.</p>
                </div>
                <Link href="/dashboard/manager/packages/new" className="bg-slate-900 text-white px-4 py-2 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2">
                    <RiAddLine size={16} /> New Package
                </Link>
            </div>

            <div className="bg-white border border-slate-200 overflow-hidden">
                <DataTable columns={columns} data={packages} loading={loading} actions={actions} />
            </div>
        </div>
    )
}

export default EditorPackages
