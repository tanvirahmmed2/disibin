import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { RiArrowRightLine } from 'react-icons/ri'

const PackageCard = ({ pack }) => {
    return (
        <div className="card-premium h-full flex flex-col group overflow-hidden bg-white">
            <div className='relative w-full aspect-[4/3] overflow-hidden'>
                <div className="absolute inset-0 bg-emerald-600/10 mix-blend-multiply z-10 group-hover:bg-transparent transition-all duration-500"></div>
                <Image 
                    src={pack.image} 
                    alt={pack.title} 
                    fill
                    className='object-cover transform group-hover:scale-110 transition-transform duration-700' 
                />
            </div>
            
            <div className='flex flex-col flex-1 p-6 z-20 bg-white relative'>
                <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                        {pack.title}
                    </h3>
                </div>
                
                <p className="text-slate-500 text-sm mb-6 flex-1 line-clamp-2">
                    {pack.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Starting at</span>
                        <span className="text-xl font-black text-emerald-600">${pack.price || '99'}</span>
                    </div>

                    <Link 
                        href={`/packages/${pack.slug}`} 
                        className="w-12 h-12 bg-slate-50 text-slate-400 flex items-center justify-center rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 transform group-hover:scale-105 group-hover:rotate-[-10deg]"
                    >
                        <RiArrowRightLine size={24} className="group-hover:rotate-[10deg] transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default PackageCard

