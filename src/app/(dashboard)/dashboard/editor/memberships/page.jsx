'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DataTable from '@/component/dashboard/DataTable'
import { RiEdit2Line, RiDeleteBin6Line, RiAddLine, RiInformationLine } from 'react-icons/ri'
import Link from 'next/link'
import { MdDeleteOutline, MdEditDocument } from 'react-icons/md'

const EditorMemberships = () => {
    const [memberships, setMemberships] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchMemberships = async () => {
        try {
            const res = await axios.get('/api/membership')
            if (res.data.success) {
                setMemberships(res.data.data)
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
            const res = await axios.delete(`/api/membership`,{data:{id}, withCredentials:true})
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



    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tier Structures</h1>
                    <p className="text-slate-500 font-medium">Define and refine the platform access levels and pricing.</p>
                </div>
                <Link href="/dashboard/editor/memberships/new" className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-slate-900/10 hover:bg-emerald-500 transition-all active:scale-95">
                    <RiAddLine size={24} />
                    <span>Create Plan</span>
                </Link>
            </div>
            {
                memberships.length === 0 ? <div className='w-full h-full flex items-center justify-center p-20 font-semibold'>
                    <p>No membership found</p>
                </div> : <div className='w-full flex flex-col items-center gap-1 font-semibold'>
                    <div className='w-full flex flex-row items-center justify-between bg-emerald-100 rounded-t-2xl p-4 '>
                        <p>Title</p>
                        <p>Actions</p>
                    </div>
                    {
                        memberships.map((membership) => (
                            <div key={membership._id} className='w-full flex flex-row items-center justify-between p-4 shadow even:bg-slate-100'>
                                <p>{membership.title}</p>
                                <div className='w-auto flex flex-row items-center justify-center gap-4 text-xl'>
                                    <Link href={`/dashboard/editor/memberships/${membership.slug}`}><MdEditDocument /></Link>
                                    <button onClick={() => handleDelete(membership._id)}><MdDeleteOutline /></button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            }

        </div>
    )
}

export default EditorMemberships
