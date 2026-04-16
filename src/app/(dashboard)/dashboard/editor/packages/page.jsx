'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DataTable from '@/component/dashboard/DataTable'
import Link from 'next/link'
import { RiAddLine, RiEdit2Line, RiDeleteBin6Line } from 'react-icons/ri'

const EditorPackages = () => {
    const [packages, setPackages] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchPackages = async () => {
        try {
            const res = await axios.get('/api/package', { withCredentials: true })
            setPackages(res.data.payload)
        } catch (error) {
            console.error('Failed to fetch packages', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return
        try {
            await axios.delete('/api/package', { data: { id }, withCredentials: true })
            fetchPackages()
        } catch (error) {
            alert('Failed to delete package')
        }
    }

    useEffect(() => {
        fetchPackages()
    }, [])

    const columns = [
        { label: 'Name', key: 'title', render: (row) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-700">{row.title}</span>
                <span className="text-[10px] text-slate-400 font-mono tracking-tight uppercase">{row.code}</span>
            </div>
        )},
        { label: 'Category', key: 'category', render: (row) => (
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">{row.category}</span>
        )},
        { label: 'Price', key: 'price', render: (row) => (
            <span className="font-bold text-slate-900">${row.price}</span>
        )},
    ]

    const actions = (row) => (
        <div className="flex gap-2">
            <Link href={`/dashboard/packages/${row.slug}`} className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-all">
                <RiEdit2Line size={18} />
            </Link>
            <button onClick={() => handleDelete(row._id)} className="p-2 hover:bg-rose-50 rounded-lg text-rose-500 transition-all">
                <RiDeleteBin6Line size={18} />
            </button>
        </div>
    )

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Catalog Packages</h1>
                    <p className="text-slate-500">Manage the list of packages and offerings available to clients.</p>
                </div>
                <Link href="/dashboard/new-package" className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:scale-[1.02] transition-all">
                    <RiAddLine size={24} />
                    <span>Create Package</span>
                </Link>
            </div>

            <div className="bg-white p-2 rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
                <DataTable columns={columns} data={packages} loading={loading} actions={actions} />
            </div>
        </div>
    )
}

export default EditorPackages
