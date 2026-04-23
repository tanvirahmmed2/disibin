'use client'
import React, { useContext } from 'react'
import Link from 'next/link'
import { Context } from '@/component/helper/Context'
import { RiFlashlightLine, RiArrowRightUpLine } from 'react-icons/ri'

const OfferCard = ({ offer }) => {
    const { addToWishList } = useContext(Context)

    const handleAddToWishlist = () => {
        addToWishList({
            packageId: offer.package_id,
            type: 'offer',
            title: offer.name,
            slug: offer.slug,
            price: offer.price,
            image: offer.image 
        })
    }

    return (
        <div className="group relative flex flex-col bg-white rounded-[2rem] border border-slate-100 hover:border-emerald-500/20 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/5 overflow-hidden p-8">
            <div className="absolute top-0 right-0 p-12 text-emerald-600/5 group-hover:text-emerald-600/10 transition-colors transform translate-x-4 -translate-y-4">
                <RiFlashlightLine size={140} />
            </div>
            
            <div className="relative z-10 flex-1">
                <div className="flex items-center gap-2 mb-8">
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-emerald-500/10">
                        Exclusive Deal
                    </span>
                    {offer.code && (
                        <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full">
                            {offer.code}
                        </span>
                    )}
                </div>
                
                <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight group-hover:text-emerald-500 transition-colors leading-tight">
                    {offer.name}
                </h3>
                
                <p className="text-xs text-slate-500 font-medium leading-relaxed mb-8 line-clamp-3">
                    {offer.description}
                </p>

                <div className="space-y-3 mb-10">
                    {offer.features?.slice(0, 4).map((feature, i) => (
                        <div key={i} className="flex items-center gap-3 text-slate-600 font-medium text-[11px]">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/30" />
                            {feature}
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative z-10 pt-8 border-t border-slate-50 mt-auto">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Investment</p>
                        <div className="flex items-center gap-3">
                            <span className="text-3xl font-black text-slate-900">৳{offer.price}</span>
                            {offer.original_price > offer.price && (
                                <span className="text-sm font-bold text-slate-300 line-through">৳{offer.original_price}</span>
                            )}
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="px-3 py-1 bg-slate-50 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">
                            {offer.duration_days} Days
                        </span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button 
                        onClick={handleAddToWishlist}
                        className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all active:scale-95 shadow-lg shadow-slate-900/10"
                    >
                        Add to Wishlist
                    </button>
                    <Link 
                        href={`/offers/${offer.code}`}
                        className="p-4 bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-emerald-600/5 rounded-2xl transition-all active:scale-95 border border-slate-100/50"
                    >
                        <RiArrowRightUpLine size={20} />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default OfferCard
