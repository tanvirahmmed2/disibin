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
            <section className='mb-16'>
                <div className="container-custom px-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                        <div className="max-w-3xl space-y-6">
                            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-semibold uppercase tracking-[0.2em] border border-emerald-100">
                                <RiListCheck2 size={14} /> Solutions Architecture
                            </div>
                            <h1 className="text-6xl md:text-8xl font-bold text-slate-900 tracking-tighter leading-[0.85]">
                                Service <span className="text-emerald-500">Plans.</span>
                            </h1>
                            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">
                                Strategic technical models engineered for enterprise-grade scalability, performance, and future-proof digital transformation.
                            </p>
                        </div>
                        <div className="hidden lg:block pb-4">
                            <div className="flex flex-col items-end gap-2 text-slate-300 font-semibold text-[10px] uppercase tracking-[0.3em]">
                                <span>Curated Tiers</span>
                                <div className="w-12 h-px bg-slate-200" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='w-full'>
                <div className='container-custom px-4 space-y-24'>
                    {categories.length > 0 ? categories.map((cat) => {
                        const catPackages = packages.filter(p => p.category_id === cat.category_id)
                        if (catPackages.length === 0) return null
                        return (
                            <div key={cat.category_id} className="space-y-12">
                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-semibold text-emerald-500 uppercase tracking-[0.3em] mb-1">Category</span>
                                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{cat.name}</h2>
                                    </div>
                                    <div className="h-px flex-1 bg-slate-100 mt-6"></div>
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
                            <div className="p-20 text-center bg-white border border-slate-100 rounded-2xl">
                                <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">No Packages Found</h3>
                                <p className="text-slate-500 font-medium">We are currently refining our service tiers. Check back soon!</p>
                            </div>
                        )
                    )}

                    {uncategorizedPackages.length > 0 && (
                        <div className="space-y-12">
                            <div className="flex items-center gap-6">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-semibold text-emerald-500 uppercase tracking-[0.3em] mb-1">Category</span>
                                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">General Services</h2>
                                </div>
                                <div className="h-px flex-1 bg-slate-100 mt-6"></div>
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
