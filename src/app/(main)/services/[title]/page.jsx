'use client'
import React, { use, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { Context } from '@/component/helper/Context'
import { RiCheckLine, RiArrowRightLine, RiStarFill } from 'react-icons/ri'

const ServiceDetails = ({ params }) => {
    const { title } = use(params)
    const { customServices } = useContext(Context)
    const [memberships, setMemberships] = useState([])
    const [loading, setLoading] = useState(true)

    const service = customServices?.find(s => s.title.toLowerCase().replace(/ /g, '-') === title)

    useEffect(() => {
        const fetchMemberships = async () => {
            try {
                const res = await axios.get('/api/membership')
                if (res.data.success) {
                    setMemberships(res.data.payload)
                }
            } catch (error) {
                // Handle silently
            } finally {
                setLoading(false)
            }
        }
        fetchMemberships()
    }, [])

    if (!service) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-center">
                <h2 className="text-2xl font-black text-slate-800">Service Not Found</h2>
                <Link href="/services" className="mt-4 inline-block text-emerald-600 font-bold hover:underline">Back to Services</Link>
            </div>
        </div>
    )

    return (
        <main className="min-h-screen bg-white">
            <section className="relative py-32 overflow-hidden border-b border-slate-50">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50/50 -skew-x-12 translate-x-1/2 -z-10" />
                
                <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-[0.3em] rounded-full w-fit inline-block">
                                Premium Solution
                            </span>
                            <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none">
                                {service.title}<span className="text-emerald-500">.</span>
                            </h1>
                        </div>
                        <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-xl">
                            {service.description || "Comprehensive software architecture tailored to meet the exacting standards of modern enterprise operations."}
                        </p>
                        <div className="flex flex-wrap items-center gap-6 pt-4">
                            <Link href="/contact" className="btn-primary">
                                Launch Project
                            </Link>
                            <Link href="#capabilities" className="text-slate-900 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 group">
                                Explore Features <RiArrowRightLine className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                    
                    <div className="relative aspect-square lg:aspect-[4/3] rounded-[3rem] overflow-hidden bg-slate-100 shadow-2xl">
                         <img 
                            src={service.image} 
                            alt={service.title} 
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                        />
                    </div>
                </div>
            </section>

            <section id="capabilities" className="py-32 bg-slate-50/30">
                <div className="container-custom">
                    <div className="max-w-3xl mb-24">
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6">Expert Capabilities</h2>
                        <p className="text-slate-500 font-medium text-lg leading-relaxed">
                            Deep-dive into the specific modules and engineering standards we apply to every {service.title} engagement.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {service.sections?.map((section) => (
                            <div key={section.id} className="p-10 bg-white border border-slate-100 rounded-[2.5rem] group hover:border-emerald-500/20 transition-all duration-500">
                                <div className="w-12 h-12 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                    <RiCheckLine size={20} />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight uppercase text-xs">{section.title}</h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                    {section.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="pricing" className="py-32 bg-white">
                <div className="container-custom">
                    <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-20">
                        <div className="max-w-xl space-y-4">
                            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">Scalable Tiers.</h2>
                            <p className="text-slate-500 font-medium">Select a commitment level that matches your operational requirements.</p>
                        </div>
                        <Link href="/memberships" className="btn-secondary">View All Plans</Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center p-20">
                             <div className="w-10 h-10 border-4 border-slate-100 border-t-emerald-600 rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {memberships.slice(0, 3).map((plan) => (
                                <div key={plan._id} className="p-12 bg-white border border-slate-100 rounded-[3rem] flex flex-col space-y-10 group hover:border-slate-900 transition-all duration-500">
                                     <div className="space-y-4 text-center">
                                         <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto text-slate-300 group-hover:text-emerald-500 transition-colors">
                                             <RiStarFill size={32} />
                                         </div>
                                         <h4 className="text-2xl font-black text-slate-900 tracking-tight">{plan.title}</h4>
                                     </div>
                                     <div className="text-center">
                                         <p className="text-[40px] font-black text-slate-900 tracking-tighter">${plan.price}</p>
                                         <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{plan.duration}</p>
                                     </div>
                                     <Link href="/memberships" className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest text-center hover:bg-emerald-600 transition-all duration-300">
                                         Commence Plan
                                     </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}

export default ServiceDetails


