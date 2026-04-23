'use client'
import React, { useState, useEffect } from 'react'
import { RiArrowLeftLine } from 'react-icons/ri'
import Link from 'next/link'
import axios from 'axios'
import { useParams } from 'next/navigation'
import UpdateOffer from '@/component/forms/UpdateOffer'

const EditOfferPage = () => {
    const { slug } = useParams()
    const [offer, setOffer] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOffer = async () => {
            try {
                const res = await axios.get(`/api/offers/${slug}`)
                if (res.data.success) {
                    setOffer(res.data.payload) 
                }
            } catch (error) {
                console.error('Failed to fetch Offer', error)
            } finally {
                setLoading(false)
            }
        }
        
        if (slug) fetchOffer()
    }, [slug])

    if (loading) return (
        <div className="flex items-center justify-center min-h-100">
            <div className="w-12 h-12 border-4 border-slate-50 border-t-primary rounded-full animate-spin"></div>
        </div>
    )

    if (!offer) return (
        <div className="p-10 text-center font-bold text-slate-400 uppercase tracking-widest">
            Offer Not Found
        </div>
    )

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4">
                <Link 
                    href="/dashboard/editor/offers" 
                    className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-bold text-xs uppercase tracking-widest"
                >
                    <RiArrowLeftLine size={16} /> Back to offers
                </Link>
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Modify Offer</h1>
                    <p className="text-slate-500 font-medium">Update the details of this offer.</p>
                </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm">
                
                <UpdateOffer offer={offer} />
            </div>
        </div>
    )
}

export default EditOfferPage