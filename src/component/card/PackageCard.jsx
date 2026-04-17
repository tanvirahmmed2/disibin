'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useContext } from 'react'
import { RiArrowRightLine, RiHeartLine } from 'react-icons/ri'
import { Context } from '@/component/helper/Context'

const PackageCard = ({ pack }) => {
    const { addToWishList } = useContext(Context)

    const handleWishlist = (e) => {
        e.preventDefault()
        addToWishList({
            itemId: pack._id,
            type: 'package',
            title: pack.title,
            price: pack.price,
            slug: pack.slug,
            image: pack.image
        })
    }

    return (
        <div className="group flex flex-col bg-white overflow-hidden rounded-[2.5rem] border border-slate-100 hover:border-primary/10 transition-all duration-500">
            <div className='relative w-full aspect-[16/10] overflow-hidden bg-slate-50 border-b border-slate-50'>
                <Image 
                    src={pack.image} 
                    alt={pack.title} 
                    fill
                    className='object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000' 
                />
            </div>
            
            <div className='p-10 flex flex-col flex-1 space-y-8'>
                <div className='space-y-4'>
                    <div className='flex items-center gap-2'>
                        <span className='w-1 h-1 rounded-full bg-primary/50' />
                        <span className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-400'>{pack.category || 'Standard Plan'}</span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-tight group-hover:text-primary transition-colors">
                        {pack.title}
                    </h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-2">
                        {pack.description}
                    </p>
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-slate-50 mt-auto">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Architecture Cost</span>
                        <span className="text-3xl font-black text-slate-900 tracking-tighter group-hover:text-primary transition-colors">${pack.price || '99'}</span>
                    </div>

                    <div className="flex gap-2">
                        <button 
                            onClick={handleWishlist}
                            className="w-14 h-14 bg-slate-50 text-slate-400 hover:text-primary flex items-center justify-center rounded-2xl transition-all duration-300 transform active:scale-95"
                        >
                            <RiHeartLine size={24} />
                        </button>
                        <Link 
                            href={`/packages/${pack.slug}`} 
                            className="w-14 h-14 bg-slate-900 text-white flex items-center justify-center rounded-2xl hover:bg-primary transition-all duration-300 transform active:scale-95"
                        >
                            <RiArrowRightLine size={24} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default PackageCard

