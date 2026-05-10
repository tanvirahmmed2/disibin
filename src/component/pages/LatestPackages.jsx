'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { RiArrowRightLine, RiFlashlightLine } from 'react-icons/ri'
import PackageCard from '../card/PackageCard'

const LatestPackages = () => {
    const [packages, setPackages] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const res = await axios.get('/api/package')
                setPackages(res.data.data?.slice(0, 3) || [])
            } catch (error) {
                console.error('Failed to fetch latest packages', error)
            } finally {
                setLoading(false)
            }
        }
        fetchPackages()
    }, [])

    if (loading) {
        return (
            <section className="w-full py-24 bg-slate-50/50">
                <div className="container-custom px-4">
                    <div className="flex flex-col items-center justify-center min-h-100">
                        <div className="w-10 h-10 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
                    </div>
                </div>
            </section>
        )
    }

    if (packages.length === 0) return null

    return (
        <section className="w-full py-24 bg-slate-50/50 border-y border-slate-100">
            <div className="container-custom px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
                    <div className="max-w-2xl space-y-6">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-semibold uppercase tracking-[0.2em] border border-emerald-100">
                            <RiFlashlightLine size={14} /> New Opportunities
                        </div>
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tighter"
                        >
                            Latest <span className="text-emerald-500">Packages.</span>
                        </motion.h2>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-lg text-slate-500 font-medium leading-relaxed"
                        >
                            Explore our newest service tiers engineered to accelerate your digital growth with precision and scale.
                        </motion.p>
                    </div>
                    
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Link 
                            href="/packages" 
                            className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-2xl text-xs font-bold uppercase tracking-widest border border-slate-200 hover:border-emerald-500/20 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
                        >
                            View All Plans
                            <RiArrowRightLine size={18} className="group-hover:translate-x-1 transition-transform text-emerald-500" />
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                    {packages.map((pkg, index) => (
                         <PackageCard pack={{ ...pkg, id: pkg.package_id }} 
                            key={pkg.package_id}/>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default LatestPackages
