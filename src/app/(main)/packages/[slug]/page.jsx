import AddToWishlist from '@/component/button/AddToWishlist'
import { BASE_URL } from '@/lib/database/secret'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaPlus, FaStar } from 'react-icons/fa'

const Package = async ({ params }) => {
    const { slug } = await params
    const res = await fetch(`${BASE_URL}/api/package/${slug}`, {
        method: 'GET',
        cache: 'no-store'
    })

    const data = await res.json()
    if (!data.success) return <div className='w-full flex items-center justify-center'>
        <p>No Data Found!</p>
    </div>
    const pack = data.data
    return (
        <div className='w-full max-w-4xl mx-auto flex flex-col items-center gap-4 p-4 min-h-screen pt-24'>
            <div className='w-full overflow-hidden relative'>
                <Image src={pack.image} alt='package cover' width={1000} height={1000} className='w-full border border-slate-100 shadow-xl object-cover aspect-video rounded-3xl' />
            </div>
            
            <div className='w-full space-y-6'>
                <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className='text-4xl font-black text-slate-900 tracking-tighter'>{pack.name}</h1>
                        <p className="text-emerald-500 font-bold uppercase tracking-widest text-[10px]">{pack.category_name}</p>
                    </div>
                    <div className="text-right px-6 py-3 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-900/10">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Architecture Cost</p>
                        <div className="flex items-baseline justify-end gap-2">
                            <p className="text-3xl font-black tracking-tighter">৳{pack.price}</p>
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">/ {pack.duration_days} Days</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <AddToWishlist pack={pack} />
                    <Link className='flex-1 bg-emerald-500 text-white py-4 font-black uppercase tracking-widest text-[11px] text-center rounded-2xl shadow-lg shadow-emerald-500/20 hover:bg-slate-900 transition-all' href="https://api.whatsapp.com/send/?phone=8801805003886&text&type=phone_number&app_absent=0">Ask for demo</Link>
                </div>

                <div className="space-y-4 pt-4">
                    <p className='text-slate-500 text-lg font-medium leading-relaxed'>{pack.description}</p>
                </div>

                <div className='w-full space-y-6 pt-6 border-t border-slate-100'>
                    <h3 className='text-xl font-black text-slate-900 uppercase tracking-tight'>Strategic Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pack.features?.map((e) => (
                            <div key={e} className='flex gap-3 items-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm'>
                                <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                                    <FaStar size={12} />
                                </div>
                                <span className="text-sm font-bold text-slate-700">{e}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Package
