'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { RiRocketLine, RiHeartLine, RiGlobalLine, RiTeamLine } from 'react-icons/ri'

const Bio = () => {
    const stats = [
        { label: 'Projects Shipped', value: '150+', icon: <RiRocketLine /> },
        { label: 'Happy Clients', value: '100+', icon: <RiHeartLine /> },
        { label: 'Global Reach', value: '24/7', icon: <RiGlobalLine /> },
        { label: 'Expert Staff', value: '10+', icon: <RiTeamLine /> },
    ]

    return (
        <section className='w-full py-24 bg-white'>
            <div className='container-custom grid grid-cols-1 lg:grid-cols-2 gap-20 items-center'>
                <div className='space-y-8'>
                    <div className='space-y-4'>
                        <h3 className='text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600'>Our Philosophy</h3>
                        <h2 className='text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight'>
                            A High-Care Studio Built On <span className='text-slate-400'>Clarity & Impact.</span>
                        </h2>
                    </div>
                    <p className='text-slate-500 font-medium leading-relaxed max-w-lg'>
                        We’re a team focused on clarity, speed, and friendly collaboration. We strip away the fluff to build digital infrastructure that works as hard as you do.
                    </p>
                    <div className='pt-4'>
                         <button className='px-8 py-4 bg-slate-50 text-slate-900 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-slate-100 transition-all active:scale-95'>
                            Learn Our Method
                         </button>
                    </div>
                </div>

                <div className='grid grid-cols-2 gap-6'>
                    {stats.map((stat, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            className='p-10 bg-slate-50/50 border border-slate-100 rounded-[2.5rem] flex flex-col items-center text-center space-y-4 hover:border-emerald-500/20 transition-all group'
                        >
                            <div className='text-2xl text-slate-300 group-hover:text-emerald-500 transition-colors'>
                                {stat.icon}
                            </div>
                            <div>
                                <h4 className='text-3xl font-black text-slate-900 tracking-tighter'>{stat.value}</h4>
                                <p className='text-[10px] font-black uppercase tracking-widest text-slate-400'>{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Bio
