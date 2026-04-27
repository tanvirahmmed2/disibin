'use client'
import React, { useState } from 'react'
import { RiTicketLine, RiCheckLine, RiFlashlightLine, RiFileCopyLine, RiCheckDoubleLine, RiTimeLine, RiPercentLine, RiPriceTag3Line } from 'react-icons/ri'
import Image from 'next/image'
import toast from 'react-hot-toast'

const CouponCard = ({ coupon }) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code)
        setCopied(true)
        toast.success('Code copied!')
        setTimeout(() => setCopied(false), 2000)
    }

    const isPercentage = coupon.is_percentage
    const discountLabel = isPercentage ? `${coupon.discount}%` : `৳${coupon.discount}`

    return (
        <div className="group relative flex flex-col w-full rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_-10px_rgba(16,185,129,0.18)]"
            style={{ boxShadow: '0 4px 24px 0 rgba(16,185,129,0.08), 0 1.5px 6px 0 rgba(0,0,0,0.06)' }}
        >
            {/* ── Top Section: Image / Hero ── */}
            <div className="relative w-full aspect-[16/9] overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-800 flex-shrink-0">
                {coupon.image ? (
                    <Image
                        src={coupon.image}
                        alt={coupon.name || coupon.code}
                        fill
                        className="object-cover opacity-60 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
                    />
                ) : (
                    /* decorative background pattern */
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl" />
                        <div className="absolute bottom-0 right-0 w-64 h-40 rounded-full bg-emerald-400/10 blur-2xl" />
                        <RiTicketLine className="absolute bottom-4 right-6 text-white/5" size={120} />
                    </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />

                {/* Top-left badge */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-white border border-white/15">
                        <RiPriceTag3Line size={10} />
                        {coupon.package_id ? 'Package Deal' : 'General Discount'}
                    </span>
                    {coupon.duration_days && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500 text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-emerald-500/30">
                            <RiTimeLine size={10} /> {coupon.duration_days} Days
                        </span>
                    )}
                </div>

                {/* Big discount pill – top right */}
                <div className="absolute top-4 right-4">
                    <div className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-xl shadow-emerald-500/40 border border-emerald-300/30">
                        <span className="text-white font-black text-xl leading-none tracking-tight">{discountLabel}</span>
                        <span className="text-emerald-100/80 text-[9px] font-bold uppercase tracking-widest mt-0.5">OFF</span>
                    </div>
                </div>

                {/* Bottom: title over image */}
                <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-black text-lg leading-tight tracking-tight drop-shadow">
                        Save {discountLabel} on{' '}
                        {coupon.package_id ? 'this package' : 'any purchase'}
                    </h3>
                </div>
            </div>

            {/* ── Torn-edge divider ── */}
            <div className="relative h-5 bg-white flex-shrink-0 overflow-visible z-10">
                {/* left notch */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-50 border border-slate-100" />
                {/* right notch */}
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-50 border border-slate-100" />
                {/* dashed line */}
                <div className="absolute inset-y-1/2 left-4 right-4 border-t-2 border-dashed border-slate-100" />
            </div>

            {/* ── Bottom Section: Details ── */}
            <div className="flex flex-col flex-1 bg-white px-6 pb-6 pt-2 gap-5">

                {/* Code copy row */}
                <div className="flex items-center justify-between gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-0.5">Promo Code</p>
                        <p className="font-mono font-bold text-slate-800 text-sm tracking-widest">{coupon.code}</p>
                    </div>
                    <button
                        onClick={() => handleCopy(coupon.code)}
                        title="Copy code"
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 active:scale-95
                            ${copied
                                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                                : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-400 hover:text-emerald-600'
                            }`}
                    >
                        {copied ? <RiCheckDoubleLine size={14} /> : <RiFileCopyLine size={14} />}
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>

                {/* Features */}
                {coupon.features?.length > 0 && (
                    <div className="flex flex-col gap-2">
                        {coupon.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-2.5 text-slate-600 text-xs font-semibold">
                                <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                                    <RiCheckLine size={10} />
                                </div>
                                {feature}
                            </div>
                        ))}
                    </div>
                )}
                {!coupon.features && (
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold italic">
                        <RiFlashlightLine size={13} /> Generic site-wide benefits apply
                    </div>
                )}

                {/* Price + Expiry */}
                <div className="flex items-end justify-between pt-4 border-t border-slate-100">
                    {/* Price */}
                    <div>
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-1">
                            {coupon.price !== null ? 'Final Price' : 'Discount'}
                        </span>
                        {coupon.price !== null ? (
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-2xl font-black text-slate-900 tracking-tight">৳{coupon.price}</span>
                                {coupon.original_price > coupon.price && (
                                    <span className="text-xs font-bold text-slate-300 line-through">৳{coupon.original_price}</span>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-emerald-600 tracking-tight">{discountLabel}</span>
                                <span className="text-xs font-black text-emerald-500 uppercase">OFF</span>
                            </div>
                        )}
                    </div>

                    {/* Expiry */}
                    {coupon.end_date && (
                        <div className="text-right">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-1">Expires</span>
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-lg border border-red-100">
                                <RiTimeLine size={11} />
                                {new Date(coupon.end_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CouponCard
