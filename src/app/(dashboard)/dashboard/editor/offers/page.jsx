'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DataTable from '@/component/dashboard/DataTable'
import Link from 'next/link'
import { RiAddLine, RiEdit2Line, RiDeleteBin6Line } from 'react-icons/ri'

const EditorOffers = () => {
    const [offers, setOffers] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchOffers = async () => {
        try {
            const res = await axios.get('/api/offers', { withCredentials: true })
            if (res.data.success) {
                setOffers(res.data.payload)
            }
        } catch (error) {
            console.error('Failed to fetch offers', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return
        try {
            await axios.delete(`/api/offers/${id}`, { withCredentials: true })
            fetchOffers()
        } catch (error) {
            alert('Failed to delete offer')
        }
    }

    useEffect(() => {
        fetchOffers()
    }, [])

    const columns = [
        { label: 'Name', key: 'title', render: (row) => (
            <div className="flex flex-col">
                <span className="font-black text-slate-800 tracking-tight">{row.title}</span>
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{row.slug}</span>
            </div>
        )},
        { label: 'Status', key: 'status', render: (row) => (
            <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${row.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                {row.status}
            </span>
        )},
        { label: 'Price', key: 'price', render: (row) => (
            <div className="flex flex-col">
                <span className="font-black text-slate-900">BDT {row.price - row.discount}</span>
                {row.discount > 0 && <span className="text-[10px] text-slate-400 line-through">BDT {row.price}</span>}
            </div>
        )},
    ]

    const actions = (row) => (
        <div className="flex gap-2">
            <Link href={`/dashboard/editor/offers/${row._id}`} className="p-2 hover:bg-primary/5 rounded-lg text-primary transition-all">
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
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Exclusive Offers</h1>
                    <p className="text-slate-500 font-medium">Manage flash deals and limited-time strategic opportunities.</p>
                </div>
                <Link href="/dashboard/editor/offers/new" className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-slate-900/10 hover:bg-primary transition-all active:scale-95">
                    <RiAddLine size={24} />
                    <span>Create Offer</span>
                </Link>
            </div>

            <div className="bg-white p-2 rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
                <DataTable columns={columns} data={offers} loading={loading} actions={actions} />
            </div>
        </div>
    )
}

export default EditorOffers
