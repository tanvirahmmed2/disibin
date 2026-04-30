'use client'
import React, { use, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Context } from '@/component/helper/Context'
import { RiCheckLine, RiArrowRightLine, RiStarFill } from 'react-icons/ri'
import Image from 'next/image'

const ServiceDetails = ({ params }) => {
    const { title } = use(params)
    const { customServices } = useContext(Context)
    const [packages, setPackages] = useState([])
    const [loading, setLoading] = useState(true)

    const service = customServices?.find(s => s.id === title)

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const res = await axios.get('/api/package')
                if (res.data.success) {
                    setPackages(res.data.data)
                }
            } catch (error) {
                
            } finally {
                setLoading(false)
            }
        }
        fetchPackages()
    }, [])

    if (!service) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-center space-y-6">
                <h2 className="text-4xl font-bold text-slate-800 tracking-tighter">Service Not Found</h2>
                <p className="text-slate-500 font-medium">The service you're looking for doesn't exist or has been moved.</p>
                <Link href="/services" className="inline-flex items-center gap-2 text-emerald-500 font-bold hover:gap-3 transition-all">
                    <RiArrowRightLine className="rotate-180" /> Back to Services
                </Link>
            </div>
        </div>
    )

    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-24 pb-20 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50/50 -skew-x-12 translate-x-1/4 -z-10" />
                <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] -z-10" />
                
                <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase tracking-[0.3em] rounded-full w-fit inline-block border border-emerald-500/20">
                                Enterprise Solution
                            </span>
                            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tighter leading-[0.9] lg:leading-[0.85]">
                                {service.title.split(' ').map((word, i) => (
                                    <span key={i} className="block">
                                        {word}{i === service.title.split(' ').length - 1 && <span className="text-emerald-500">.</span>}
                                    </span>
                                ))}
                            </h1>
                        </div>
                        <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-xl">
                            {service.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-6 pt-4">
                            <Link href="/contact" className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all shadow-xl shadow-slate-900/10 hover:shadow-emerald-500/20">
                                Start Your Project
                            </Link>
                            <Link href="#capabilities" className="text-slate-900 font-bold text-sm flex items-center gap-3 group">
                                Learn More <RiArrowRightLine className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative"
                    >
                        <div className="relative aspect-square lg:aspect-[4/5] rounded-[3rem] overflow-hidden bg-slate-100 shadow-xl">
                             <Image
                                width={1200}
                                height={1500}
                                src={service.image} 
                                alt={service.title} 
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Capabilities Section */}
            <section id="capabilities" className="py-24 bg-slate-50/50 relative">
                <div className="container-custom">
                    <div className="max-w-3xl mb-16">
                        <span className="text-emerald-500 font-bold text-xs uppercase tracking-[0.4em] mb-4 block">Capabilities</span>
                        <h2 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tighter mb-6 leading-tight">Expert Engineering Standards<span className="text-emerald-500">.</span></h2>
                        <p className="text-slate-500 font-medium text-lg leading-relaxed">
                            Every {service.title} project follows our rigorous development lifecycle to ensure scalability, security, and exceptional performance.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {service.features?.map((feature, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-8 bg-white border border-slate-100 rounded-[2rem] group hover:border-emerald-500/20 transition-all duration-500"
                            >
                                <div className="w-12 h-12 bg-slate-50 text-slate-300 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                                    <RiCheckLine size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-4 tracking-tight">{feature}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed text-sm">
                                    Advanced implementation of {feature.toLowerCase()} to drive operational excellence and business growth.
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Packages Section */}
            <section id="pricing" className="py-24 bg-white">
                <div className="container-custom">
                    <div className="flex flex-col lg:flex-row items-end justify-between gap-8 mb-16">
                        <div className="max-w-2xl space-y-4">
                            <span className="text-emerald-500 font-bold text-xs uppercase tracking-[0.4em] block">Pricing Models</span>
                            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tighter leading-tight">Flexible & Scalable Investment<span className="text-emerald-500">.</span></h2>
                            <p className="text-slate-500 font-medium text-lg">Select the tier that aligns with your current scale and future ambitions.</p>
                        </div>
                        <Link href="/packages" className="px-8 py-4 border-2 border-slate-900 text-slate-900 rounded-xl font-bold hover:bg-slate-900 hover:text-white transition-all whitespace-nowrap text-sm">
                            Explore All Plans
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center p-20">
                             <div className="w-10 h-10 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {packages.slice(0, 3).map((plan, idx) => (
                                <motion.div 
                                    key={plan.package_id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`p-10 bg-white border border-slate-100 rounded-[3rem] flex flex-col space-y-10 group hover:border-slate-900 transition-all duration-500 relative overflow-hidden ${idx === 1 ? 'scale-105 shadow-xl z-10' : ''}`}
                                >
                                    {idx === 1 && (
                                        <div className="absolute top-6 right-6 px-4 py-1 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                                            Most Popular
                                        </div>
                                    )}
                                     <div className="space-y-4">
                                         <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-emerald-500 transition-all duration-500">
                                             <RiStarFill size={32} />
                                         </div>
                                         <h4 className="text-2xl font-bold text-slate-900 tracking-tight">{plan.name}</h4>
                                     </div>
                                     <div>
                                         <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-bold text-slate-900 tracking-tighter">৳{plan.price}</span>
                                            <span className="text-slate-400 font-bold text-sm">/ {plan.duration}</span>
                                         </div>
                                     </div>
                                     <Link href={`/packages/${plan.slug}`} className="w-full py-5 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-center hover:bg-emerald-500 transition-all duration-300 text-sm">
                                         Select Package
                                     </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Final */}
            <section className="pb-24 px-6">
                <div className="container-custom bg-emerald-600 rounded-[3rem] p-12 md:p-16 text-center text-white relative overflow-hidden">
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter leading-tight max-w-3xl mx-auto">
                            Transform your business vision into reality.
                        </h2>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/contact" className="px-10 py-5 bg-white text-emerald-600 rounded-xl font-bold uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-xl">
                                Start Consultation
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default ServiceDetails



