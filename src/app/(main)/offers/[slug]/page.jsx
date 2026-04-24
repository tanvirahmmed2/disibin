'use client'
import React, { useEffect, useState, useContext } from 'react'
import { Context } from '@/component/helper/Context'
import axios from 'axios'
import { RiFlashlightLine, RiCheckLine, RiArrowLeftLine } from 'react-icons/ri'
import Link from 'next/link'
import Image from 'next/image'

const OfferDetails = ({ params }) => {
    const { slug } = React.use(params)
    const { addToWishList } = useContext(Context)
    const [offer, setOffer] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOffer = async () => {
            try {
                const res = await axios.get(`/api/coupon?code=${slug}`)
                if (res.data.success) {
                    setOffer(res.data.data)
                }
            } catch (error) {
                console.error("Failed to fetch offer", error)
            } finally {
                setLoading(false)
            }
        }
        fetchOffer()
    }, [slug])

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    )

    if (!offer) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-3xl font-black text-slate-900 mb-4">Offer Not Found</h2>
                <Link href="/offers" className="text-primary font-bold hover:underline flex items-center gap-2 justify-center">
                    <RiArrowLeftLine /> Back to Offers
                </Link>
            </div>
        </div>
    )

    return (
        <main className="min-h-screen bg-slate-50 pt-32 pb-24">
            <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    
                    <div className="space-y-12">
                        <Link href="/offers" className="inline-flex items-center gap-2 text-slate-400 font-semibold hover:text-emerald-500 transition-colors text-[10px] uppercase tracking-widest">
                            <RiArrowLeftLine /> Back to all offers
                        </Link>
                        
                        <div className="space-y-6">
                            <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-semibold uppercase tracking-widest rounded-lg inline-block">Flash Deal</span>
                            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tighter leading-none">
                                {offer.name}
                            </h1>
                            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
                                {offer.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {offer.features?.map((feature, i) => (
                                <div key={i} className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm group hover:border-emerald-500/10 transition-all">
                                    <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                        <RiCheckLine size={18} />
                                    </div>
                                    <span className="text-slate-700 font-semibold text-sm">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {}
                    <div className="sticky top-32">
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-premium overflow-hidden">
                            <div className='relative w-full aspect-video bg-slate-50'>
                                {offer.image ? (
                                    <Image 
                                        src={offer.image} 
                                        alt={offer.name} 
                                        fill
                                        className='object-cover' 
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-100">
                                        <RiFlashlightLine size={120} />
                                    </div>
                                )}
                            </div>
                            
                            <div className="p-10 space-y-8">
                                <div className="space-y-6 border-b border-slate-50 pb-8">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Total Investment</p>
                                            <div className="flex items-baseline gap-3">
                                                <span className="text-4xl font-bold text-slate-900">৳{offer.price}</span>
                                                {offer.original_price > offer.price && (
                                                    <span className="text-lg font-semibold text-slate-300 line-through">৳{offer.original_price}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-[0.2em] mb-1">Coupon Code</p>
                                            <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold font-mono border border-emerald-100">{offer.code}</span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em]">{offer.duration_days} Days Validity</p>
                                </div>

                                <div className="space-y-4">
                                    <button 
                                        onClick={() => addToWishList({
                                            packageId: offer.package_id,
                                            couponId: offer.coupon_id,
                                            type: 'offer',
                                            title: offer.name,
                                            slug: offer.code,
                                            price: offer.price,
                                            image: offer.image
                                        })}
                                        className="w-full py-5 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-slate-900/10 hover:bg-emerald-600 transition-all active:scale-[0.98]"
                                    >
                                        Add to Wishlist
                                    </button>
                                    <p className="text-center text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                                        Secure payment powered by Disibin Commerce
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    )
}

export default OfferDetails
