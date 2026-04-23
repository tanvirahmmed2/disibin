'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DataTable from '@/component/dashboard/DataTable'
import Link from 'next/link'
import { RiAddLine, RiEdit2Line, RiDeleteBin6Line } from 'react-icons/ri'
import { MdDeleteOutline, MdEditDocument } from 'react-icons/md'

const EditorOffers = () => {
    const [offers, setOffers] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchOffers = async () => {
        try {
            const res = await axios.get('/api/offers', { withCredentials: true })
            if (res.data.success) {
                setOffers(res.data.data || [])
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
            await axios.delete(`/api/offers`, {data:{id}, withCredentials: true })
            fetchOffers()
        } catch (error) {
            alert('Failed to delete offer')
        }
    }

    useEffect(() => {
        fetchOffers()
    }, [])

   



    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Exclusive Offers</h1>
                    <p className="text-slate-500 font-medium">Manage flash deals and limited-time strategic opportunities.</p>
                </div>
                <Link href="/dashboard/manager/offers/new" className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-slate-900/10 hover:bg-emerald-500 transition-all active:scale-95">
                    <RiAddLine size={24} />
                    <span>Create Offer</span>
                </Link>
            </div>
 {
                offers.length===0?<div className='w-full h-full flex items-center justify-center p-20 font-semibold'>
                    <p>No offer found</p>
                </div>:<div className='w-full flex flex-col items-center gap-1 font-semibold'>
                    <div className='w-full flex flex-row items-center justify-between bg-emerald-100 rounded-t-2xl p-4 '>
                        <p>Title</p>
                        <p>Actions</p>
                    </div>
                    {
                        offers.map((offer)=>(
                            <div key={offer.package_id} className='w-full flex flex-row items-center justify-between p-4 shadow even:bg-slate-100'>
                                <p>{offer.name}</p>
                                <div className='w-auto flex flex-row items-center justify-center gap-4 text-xl'>
                                    <Link href={`/dashboard/manager/offers/${offer.slug}`}><MdEditDocument/></Link>
                                    <button onClick={()=>handleDelete(offer.package_id)}><MdDeleteOutline/></button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            }

        </div>
    )
}

export default EditorOffers
