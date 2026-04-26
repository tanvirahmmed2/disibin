'use client'
import React from 'react'
import { RiTicketLine, RiCheckLine, RiFlashlightLine } from 'react-icons/ri'
import Image from 'next/image'

const CouponCard = ({ coupon }) => {
   

    return (
        <div className="group flex flex-col bg-white w-full rounded-xl border border-slate-100 hover:border-emerald-500/10 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/5 overflow-hidden">
            <div className='relative w-full aspect-16/10 overflow-hidden bg-slate-50'>
                {coupon.image ? (
                    <Image 
                        src={coupon.image} 
                        alt={coupon.name || coupon.code} 
                        fill
                        className='object-cover group-hover:scale-110 transition-transform duration-1000' 
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-200">
                        <RiTicketLine size={80} className="opacity-10" />
                    </div>
                )}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-800 border border-white/20 shadow-sm">
                        {coupon.package_id ? 'Package Deal' : 'General Discount'}
                    </span>
                    {coupon.duration_days && (
                        <span className="px-4 py-1.5 bg-emerald-500 text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                            {coupon.duration_days} Days
                        </span>
                    )}
                </div>
                <div className="absolute top-6 right-6">
                    <div className="bg-slate-900/90 backdrop-blur-md text-white px-4 py-2 rounded-2xl border border-white/10 shadow-xl">
                        <p className="text-[8px] font-black uppercase tracking-[0.3em] opacity-60 mb-0.5 text-center">Use Code</p>
                        <p className="text-sm font-black tracking-widest font-mono text-emerald-400">{coupon.code}</p>
                    </div>
                </div>
            </div>
            
            <div className='p-10 flex flex-col flex-1 space-y-8'>
                <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4 group-hover:text-emerald-600 transition-colors">
                        {coupon.code || "Special Promotion"}
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {coupon.features?.map((feature, i) => (
                        <div key={i} className="flex items-center gap-3 text-slate-600 text-xs font-bold bg-slate-50/50 p-3 rounded-xl border border-slate-50">
                            <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
                                <RiCheckLine size={12} />
                            </div>
                            {feature}
                        </div>
                    ))}
                    {!coupon.features && (
                        <div className="flex items-center gap-3 text-slate-400 text-xs font-bold italic py-2">
                            <RiFlashlightLine size={14} /> Generic site-wide benefits apply
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Final Price</span>
                        <div className="flex items-baseline gap-2">
                            {coupon.price !== null ? (
                                <>
                                    <span className="text-3xl font-black text-slate-900 tracking-tighter">৳{coupon.price}</span>
                                    {coupon.original_price > coupon.price && (
                                        <span className="text-xs font-bold text-slate-300 line-through">৳{coupon.original_price}</span>
                                    )}
                                </>
                            ) : (
                                <span className="text-3xl font-black text-slate-900 tracking-tighter">
                                    {coupon.discount}{coupon.is_percentage ? '%' : '৳'} <span className="text-sm text-emerald-500 uppercase ml-1">OFF</span>
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {coupon.end_date && (
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 text-right">Valid Until</span>
                                <span className="text-sm font-black text-red-500 bg-red-50 px-3 py-1 rounded-lg">
                                    {new Date(coupon.end_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                        )}
                        <p
                            className="w-14 h-14 bg-slate-50 text-slate-400 hover:text-emerald-600 flex items-center justify-center rounded-2xl transition-all active:scale-90 border border-transparent hover:border-emerald-500/10"
                            title="Add to Wishlist"
                        >
                            <RiFlashlightLine size={24} />
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CouponCard
