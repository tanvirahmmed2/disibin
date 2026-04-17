'use client'
import React, { useEffect, useState, useContext } from 'react'
import { Context } from '@/component/helper/Context'
import axios from 'axios'
import { RiFlashlightLine, RiCheckLine, RiArrowLeftLine } from 'react-icons/ri'
import Link from 'next/link'

const OfferDetails = ({ params }) => {
    const { slug } = React.use(params)
    const { addToWishList } = useContext(Context)
    const [offer, setOffer] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOffer = async () => {
            try {
                const res = await axios.get(`/api/offers?slug=${slug}`)
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
                    
                    {}
                    <div className="space-y-12">
                        <Link href="/offers" className="inline-flex items-center gap-2 text-slate-400 font-bold hover:text-primary transition-colors text-sm uppercase tracking-widest">
                            <RiArrowLeftLine /> Back to all offers
                        </Link>
                        
                        <div className="space-y-6">
                            <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg inline-block">Flash Deal</span>
                            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none">
                                {offer.title}
                            </h1>
                            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
                                {offer.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {offer.features?.map((feature, i) => (
                                <div key={i} className="flex items-center gap-4 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm group hover:border-primary/20 transition-all">
                                    <div className="w-8 h-8 rounded-full bg-primary/5 text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                                        <RiCheckLine size={18} />
                                    </div>
                                    <span className="text-slate-700 font-bold text-sm">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {}
                    <div className="sticky top-32">
                        <div className="p-12 bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 space-y-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 text-primary/5 pointer-events-none">
                                <RiFlashlightLine size={180} />
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-slate-800 mb-8">Offer Summary</h3>
                                
                                <div className="space-y-6 border-b border-slate-50 pb-10">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Investment</p>
                                            <div className="flex items-center gap-3">
                                                <span className="text-5xl font-black text-slate-900">BDT {offer.price - offer.discount}</span>
                                                {offer.discount > 0 && (
                                                    <span className="text-lg text-slate-400 line-through font-bold">BDT {offer.price}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary rounded-xl w-fit">
                                        <span className="text-[10px] font-black uppercase tracking-widest">Saving BDT {offer.discount} Today</span>
                                    </div>
                                </div>

                                <div className="pt-10 space-y-4">
                                    <button 
                                        onClick={() => addToWishList({
                                            itemId: offer._id,
                                            type: 'offer',
                                            title: offer.title,
                                            slug: offer.slug,
                                            price: offer.price,
                                            discount: offer.discount
                                        })}
                                        className="w-full py-6 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-primary/20 hover:bg-slate-900 transition-all active:scale-[0.98]"
                                    >
                                        Add to Wishlist
                                    </button>
                                    <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
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
