'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DataTable from '@/component/dashboard/DataTable'
import { RiEdit2Line, RiDeleteBin6Line, RiAddLine, RiInformationLine } from 'react-icons/ri'
import Link from 'next/link'

const EditorMemberships = () => {
    const [memberships, setMemberships] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchMemberships = async () => {
        try {
            const res = await axios.get('/api/membership')
            if (res.data.success) {
                setMemberships(res.data.payload)
            }
        } catch (error) {
            console.error('Failed to fetch memberships', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this membership plan?')) return
        try {
            const res = await axios.delete(`/api/membership/${id}`)
            if (res.data.success) {
                alert('Membership deleted successfully')
                fetchMemberships()
            }
        } catch (error) {
            alert('Failed to delete membership')
        }
    }

    useEffect(() => {
        fetchMemberships()
    }, [])

    const columns = [
        { label: 'Plan Level', key: 'title', render: (row) => (
            <div className="flex flex-col">
                <span className="font-black text-slate-800 tracking-tight">{row.title}</span>
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{row.code}</span>
            </div>
        )},
        { label: 'Investment', key: 'price', render: (row) => (
            <div className="flex items-center gap-1 font-black text-slate-800">
                <span className="text-lg">${row.price}</span>
                <span className="text-[9px] text-slate-400 uppercase tracking-widest">/ {row.duration}</span>
            </div>
        )},
        { label: 'Features', key: 'features', render: (row) => (
            <p className="text-xs text-slate-500 font-medium max-w-xs truncate italic">{row.features?.join(', ') || 'Standard Features'}</p>
        )},
    ]

    const actions = (row) => (
        <div className="flex gap-2">
            <Link href={`/dashboard/editor/memberships/${row._id}`} className="p-2 hover:bg-primary/5 rounded-lg text-primary transition-all">
                <RiEdit2Line size={18} />
            </Link>
            <button onClick={() => handleDelete(row._id)} className="p-2 hover:bg-rose-50 rounded-lg text-rose-500 transition-all">
                <RiDeleteBin6Line size={18} />
            </button>
        </div>
    )

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tier Structures</h1>
                    <p className="text-slate-500 font-medium">Define and refine the platform access levels and pricing.</p>
                </div>
                <Link href="/dashboard/editor/memberships/new" className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-slate-900/10 hover:bg-primary transition-all active:scale-95">
                    <RiAddLine size={24} />
                    <span>Create Plan</span>
                </Link>
            </div>

            <div className="bg-white p-2 rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
                <DataTable columns={columns} data={memberships} loading={loading} actions={actions} />
            </div>
        </div>
    )
}

export default EditorMemberships
