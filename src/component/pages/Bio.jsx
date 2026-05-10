'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { RiRocketLine, RiHeartLine, RiGlobalLine, RiTeamLine } from 'react-icons/ri'
import Link from 'next/link'

const Bio = () => {
    const stats = [
        { label: 'Projects Shipped', value: '150+', icon: <RiRocketLine /> },
        { label: 'Happy Clients', value: '100+', icon: <RiHeartLine /> },
        { label: 'Global Reach', value: '24/7', icon: <RiGlobalLine /> },
        { label: 'Expert Staff', value: '10+', icon: <RiTeamLine /> },
    ]

    return (
        <section className='w-full py-24 bg-white'>
            <div className='container-custom grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
                <div className='space-y-8'>
                    <div className='space-y-4'>
                        <h3 className='text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-600'>Our Philosophy</h3>
                        <motion.h2
                        initial={{ opacity: 0, x:50 }}
                        whileInView={{ opacity: 1, x:0 }}
                        transition={{  duration: 1 }}
                        className='text-4xl md:text-5xl font-bold text-slate-900 tracking-tighter leading-tight'>
                            A High-Care Studio Built On <span className='text-slate-400'>Clarity & Impact.</span>
                        </motion.h2>
                    </div>
                    <motion.p
                        initial={{ opacity: 0, x:30 }}
                        whileInView={{ opacity: 1, x:0 }}
                        transition={{  duration: 1 }}
                        className='text-slate-600 font-semibold  max-w-lg'>
                        We’re a team focused on clarity, speed, and friendly collaboration. We strip away the fluff to build digital infrastructure that works as hard as you do.
                    </motion.p>
                    <div className='pt-4'>
                        <Link href={'/about'} className='px-8 py-4 bg-slate-50 text-slate-900 font-semibold uppercase tracking-widest text-[10px] rounded-xl hover:bg-slate-100 transition-all active:scale-95'>
                            Learn About
                        </Link>
                    </div>
                </div>

                <div className='grid grid-cols-2 gap-8'>
                    {stats.map((stat) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: .5 }}
                            className='p-10 bg-slate-200 border hover:shadow-xl duration-500 ease-in-out shadow-emerald-100 cursor-pointer hover:rotate-6 hover:bg-slate-100 border-slate-100 rounded-2xl flex flex-col items-center text-center space-y-4 hover:border-emerald-500/10 transition-all group'
                        >
                            <div className='text-2xl text-slate-300 group-hover:scale-150 group-hover:text-emerald-500/50 transition-colors'>
                                {stat.icon}
                            </div>
                            <div>
                                <h4 className='text-3xl font-bold text-slate-900 tracking-tighter'>{stat.value}</h4>
                                <p className='text-[10px] font-semibold uppercase tracking-widest text-slate-400'>{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Bio
