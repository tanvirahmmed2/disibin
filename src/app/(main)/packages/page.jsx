'use client'
import PackageCard from '@/component/card/PackageCard'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { RiListCheck2, RiFilter2Line } from 'react-icons/ri'

const PackagesPage = () => {
    const [packages, setPackages] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState('all')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pkgRes, catRes] = await Promise.all([
                    axios.get('/api/package'),
                    axios.get('/api/category')
                ])
                setPackages(pkgRes.data.data || [])
                setCategories(catRes.data.data || [])
            } catch (error) {
                console.error('Failed to fetch packages or categories', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) return (
        <div className='w-full min-h-screen flex items-center justify-center bg-slate-50'>
            <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
    )

    const filteredCategories = selectedCategory === 'all' 
        ? categories 
        : categories.filter(cat => cat.category_id.toString() === selectedCategory)

    const uncategorizedPackages = packages.filter(p => !p.category_id)

    return (
        <main className='w-full min-h-screen bg-slate-50 pt-24 pb-20'>
            {/* Header Section */}
            <section className='mb-16'>
                <div className="container-custom px-4">
                    <div className="max-w-3xl space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                            <RiListCheck2 /> Solutions Architecture
                        </div>
                        <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">
                            Service <span className="text-emerald-500">Plans.</span>
                        </h1>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed">
                            Strategic technical models engineered for enterprise-grade scalability and performance.
                        </p>
                    </div>
                </div>
            </section>

            {/* Filter Bar */}
            <section className="sticky top-[80px] z-20 bg-white/80 backdrop-blur-xl border-y border-slate-100 py-4 mb-12">
                <div className="container-custom px-4 flex items-center gap-4 overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-2 text-slate-400 mr-2 border-r border-slate-100 pr-4">
                        <RiFilter2Line size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Filter</span>
                    </div>
                    <button 
                        onClick={() => setSelectedCategory('all')}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            selectedCategory === 'all' 
                            ? 'bg-slate-900 text-white shadow-lg' 
                            : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
                        }`}
                    >
                        All Packages
                    </button>
                    {categories.map((cat) => (
                        <button 
                            key={cat.category_id}
                            onClick={() => setSelectedCategory(cat.category_id.toString())}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                                selectedCategory === cat.category_id.toString() 
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                                : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </section>

            {/* Content Section */}
            <section className='w-full'>
                <div className='container-custom px-4 space-y-16'>
                    {filteredCategories.length > 0 ? filteredCategories.map((cat) => {
                        const catPackages = packages.filter(p => p.category_id === cat.category_id)
                        if (catPackages.length === 0) return null
                        return (
                            <div key={cat.category_id} className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">{cat.name}</h2>
                                    <div className="h-px flex-1 bg-slate-200"></div>
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                                    {catPackages.map((pack) => (
                                        <PackageCard key={pack.package_id} pack={{...pack, id: pack.package_id}}/>
                                    ))}
                                </div>
                            </div>
                        )
                    }) : (
                        packages.length === 0 && (
                            <div className="p-20 text-center bg-white border border-slate-100 rounded-3xl">
                                <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">No Packages Found</h3>
                                <p className="text-slate-500 font-medium">We are currently refining our service tiers. Check back soon!</p>
                            </div>
                        )
                    )}

                    {/* Uncategorized Section */}
                    {(selectedCategory === 'all' && uncategorizedPackages.length > 0) && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">General Services</h2>
                                <div className="h-px flex-1 bg-slate-200"></div>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                                {uncategorizedPackages.map((pack) => (
                                    <PackageCard key={pack.package_id} pack={{...pack, id: pack.package_id}}/>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}

export default PackagesPage
