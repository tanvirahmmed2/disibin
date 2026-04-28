import AddToWishlist from '@/component/button/AddToWishlist'
import { BASE_URL } from '@/lib/database/secret'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaCheck, FaWhatsapp, FaLayerGroup, FaClock, FaTag } from 'react-icons/fa'
import { RiSecurePaymentLine, RiCustomerService2Line, RiRocketLine } from 'react-icons/ri'

const Package = async ({ params }) => {
    const { slug } = await params
    const res = await fetch(`${BASE_URL}/api/package/${slug}`, {
        method: 'GET',
        cache: 'no-store'
    })

    const data = await res.json()
    if (!data.success) return (
        <div className='w-full min-h-screen flex items-center justify-center bg-slate-50'>
            <div className="text-center space-y-4">
                <div className="text-6xl font-black text-slate-200">404</div>
                <p className="text-slate-500 font-medium">No Package Found!</p>
                <Link href="/packages" className="inline-block px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:bg-emerald-500">Go Back</Link>
            </div>
        </div>
    )

    const pack = data.data

    return (
        <div className='w-full min-h-screen bg-white'>
            {/* Hero Section */}
            <section className="relative w-full h-[60vh] min-h-100 flex items-end">
                <Image 
                    src={pack.image} 
                    alt={pack.name} 
                    fill 
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="container-custom relative px-4 pb-12 w-full">
                    <div className="max-w-4xl space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500 text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em]">
                            <FaLayerGroup size={10} /> {pack.category_name || 'Service'}
                        </div>
                        <h1 className='text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight'>
                            {pack.name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-white/60 text-xs font-bold uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                                <FaClock className="text-emerald-500" /> {pack.duration_days} Days Access
                            </div>
                            <div className="flex items-center gap-2">
                                <FaTag className="text-emerald-500" /> BDT {pack.price}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="container-custom px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-8 space-y-16">
                        <div className="space-y-6">
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                                <span className="w-8 h-1 bg-emerald-500 rounded-full" />
                                Overview
                            </h2>
                            <p className='text-slate-600 text-lg font-medium leading-relaxed whitespace-pre-line'>
                                {pack.description}
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                                    <span className="w-8 h-1 bg-emerald-500 rounded-full" />
                                    Strategic Features
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {pack.features?.map((feature, idx) => (
                                    <div key={idx} className='group flex gap-4 p-6 bg-slate-50 border border-slate-100 rounded-3xl transition-all hover:bg-white hover:shadow-2xl hover:shadow-emerald-500/5 hover:-translate-y-1'>
                                        <div className="w-10 h-10 rounded-2xl bg-white text-emerald-500 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                            <FaCheck size={14} />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{feature.name}</h4>
                                            {feature.description && (
                                                <p className="text-xs text-slate-500 font-medium leading-relaxed">{feature.description}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4">
                        <div className="sticky top-24 space-y-6">
                            <div className="p-8 bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-900/20 text-white space-y-8">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Total Investment</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-black tracking-tighter">৳{pack.price}</span>
                                        <span className="text-xs font-bold text-white/40 uppercase tracking-widest">/ {pack.duration_days}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <AddToWishlist pack={pack} />
                                        <Link 
                                            className='flex-1 bg-emerald-500 text-white py-4 font-black uppercase tracking-widest text-[11px] text-center rounded-2xl shadow-lg shadow-emerald-500/20 hover:bg-white hover:text-slate-900 transition-all active:scale-95' 
                                            href="https://api.whatsapp.com/send/?phone=8801805003886&text&type=phone_number&app_absent=0"
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                <FaWhatsapp size={16} /> Consult Now
                                            </div>
                                        </Link>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5 space-y-4">
                                    <div className="flex items-center gap-3 text-[10px] font-bold text-white/60 uppercase tracking-widest">
                                        <RiSecurePaymentLine className="text-emerald-500" size={16} /> Secure Infrastructure
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-bold text-white/60 uppercase tracking-widest">
                                        <RiCustomerService2Line className="text-emerald-500" size={16} /> 24/7 Expert Support
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-bold text-white/60 uppercase tracking-widest">
                                        <RiRocketLine className="text-emerald-500" size={16} /> Rapid Deployment
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-xl text-center space-y-2">
                                <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest">Need a custom plan?</p>
                                <p className="text-[10px] text-emerald-600 font-medium">Contact our architects for a tailored solution.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Package
