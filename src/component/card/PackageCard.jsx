'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import React, { useContext } from 'react'
import { RiArrowRightLine, RiHeartLine, RiCheckLine } from 'react-icons/ri'
import { Context } from '@/component/helper/Context'

const PackageCard = ({ pack }) => {
    const { addToWishList } = useContext(Context)

    const handleWishlist = (e) => {
        e.preventDefault()
        addToWishList(pack)
    }

    return (
        <motion.div
                    initial={{ opacity: 0, }}
                    whileInView={{ opacity: 1, }}
                    transition={{ duration: 1 }} className="group flex flex-col bg-white w-full rounded-2xl border border-slate-100 hover:border-emerald-500/10 transition-all duration-300 hover:shadow-md">
            <div className='relative w-full aspect-video overflow-hidden rounded-t-2xl'>
                <Image 
                    src={pack.image} 
                    alt={pack.name} 
                    fill
                    className='object-cover group-hover:scale-105 transition-all duration-700' 
                />
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-semibold uppercase tracking-widest text-slate-800 border border-white/20">
                        {pack.category_name || 'Standard'}
                    </span>
                </div>
            </div>
            
            <div className='p-8 flex flex-col flex-1'>
                <div className='mb-8'>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-3 group-hover:text-emerald-600 transition-colors">
                        {pack.name}
                    </h3>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed line-clamp-2">
                        {pack.description}
                    </p>
                </div>

                {pack.features?.length > 0 && (
                    <div className="space-y-3 mb-8">
                        {pack.features.slice(0, 10).map((feature, index) => (
                            <div key={index} className="flex items-start gap-2.5 group/feat">
                                <div className="mt-0.5 w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover/feat:bg-emerald-500 group-hover/feat:text-white transition-colors">
                                    <RiCheckLine size={10} />
                                </div>
                                <span className="text-slate-600 text-xs font-medium leading-tight">
                                    {typeof feature === 'object' ? feature.name : feature}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-1">Total Fee</span>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl font-bold text-slate-900 tracking-tight">৳{pack.price}</span>
                            <span className="text-[10px] font-semibold text-slate-300">/ {pack.duration_days}d</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button 
                            onClick={handleWishlist}
                            className="w-11 h-11 bg-slate-50 text-slate-400 hover:text-emerald-600 flex items-center justify-center rounded-xl transition-all active:scale-95 border border-transparent hover:border-emerald-500/10"
                        >
                            <RiHeartLine size={20} />
                        </button>
                        <Link 
                            href={`/packages/${pack.slug}`} 
                            className="w-11 h-11 bg-slate-900 text-white flex items-center justify-center rounded-xl hover:bg-emerald-600 transition-all active:scale-95"
                        >
                            <RiArrowRightLine size={20} />
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}


export default PackageCard

