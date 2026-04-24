'use client'
import React, { useContext } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
        <div className="group flex flex-col bg-white w-full rounded-2xl border border-slate-100 hover:border-emerald-500/10 transition-all duration-300 hover:shadow-md overflow-hidden">
            <div className='relative w-full aspect-[16/9] overflow-hidden rounded-t-2xl bg-slate-50'>
                {offer.image ? (
                    <Image 
                        src={offer.image} 
                        alt={offer.name} 
                        fill
                        className='object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700' 
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-200">
                        <RiFlashlightLine size={80} className="opacity-10" />
                    </div>
                )}
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-semibold uppercase tracking-widest text-slate-800 border border-white/20">
                        Exclusive Deal
                    </span>
                </div>
                {offer.code && (
                    <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-semibold uppercase tracking-[0.2em] rounded-full">
                            {offer.code}
                        </span>
                    </div>
                )}
            </div>
            
            <div className='p-8 flex flex-col flex-1'>
                <div className='mb-8'>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-3 group-hover:text-emerald-600 transition-colors">
                        {offer.name}
                    </h3>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed line-clamp-2">
                        {offer.description}
                    </p>
                </div>

                <div className="space-y-2 mb-8 flex-1">
                    {offer.features?.slice(0, 3).map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-slate-400 text-[10px] font-medium">
                            <div className="w-1 h-1 rounded-full bg-emerald-500" />
                            {feature}
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-1">Investment</span>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl font-bold text-slate-900 tracking-tight">৳{offer.price}</span>
                            {offer.original_price > offer.price && (
                                <span className="text-[10px] font-semibold text-slate-300 line-through">৳{offer.original_price}</span>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button 
                            onClick={handleAddToWishlist}
                            className="w-11 h-11 bg-slate-50 text-slate-400 hover:text-emerald-600 flex items-center justify-center rounded-xl transition-all active:scale-95 border border-transparent hover:border-emerald-500/10"
                        >
                            <RiFlashlightLine size={20} />
                        </button>
                        <Link 
                            href={`/offers/${offer.code}`} 
                            className="w-11 h-11 bg-slate-900 text-white flex items-center justify-center rounded-xl hover:bg-emerald-600 transition-all active:scale-95"
                        >
                            <RiArrowRightUpLine size={20} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OfferCard
