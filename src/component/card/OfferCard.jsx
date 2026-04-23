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
            discount: offer.discount,
            image: offer.image 
        })
    }

    return (
        <div className="group p-4 w-full bg-white border border-slate-100 rounded-[2.5rem] hover:border-emerald-600/20 transition-all duration-500 hover:shadow-premium relative overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 right-0 p-8 text-emerald-600/5 group-hover:text-emerald-600/10 transition-colors">
                <RiFlashlightLine size={100} />
            </div>
            
            <div className="relative z-10 flex-1">
                <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 bg-emerald-600/5 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-lg">Exclusive Offer</span>
                </div>
                
                <h3 className="text-2xl font-black text-slate-800 mb-4 tracking-tight group-hover:text-emerald-600 transition-colors">
                    {offer.name}
                </h3>
                
                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8 line-clamp-3">
                    {offer.description}
                </p>

                <div className="space-y-3 mb-8">
                    {offer.features?.slice(0, 4).map((feature, i) => (
                        <div key={i} className="flex items-center gap-3 text-slate-600 font-medium text-xs">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-600/40" />
                            {feature}
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative z-10 pt-6 border-t border-slate-50 mt-auto">
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Investment</p>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl font-black text-slate-900">BDT {offer.price - offer.discount}</span>
                            {offer.discount > 0 && (
                                <span className="text-sm text-slate-400 line-through font-bold">BDT {offer.price}</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button 
                        onClick={handleAddToWishlist}
                        className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-slate-900/10"
                    >
                        Add to Wishlist
                    </button>
                    <Link 
                        href={`/offers/${offer.slug}`}
                        className="p-4 bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-emerald-600/5 rounded-2xl transition-all active:scale-95"
                    >
                        <RiArrowRightUpLine size={20} />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default OfferCard
