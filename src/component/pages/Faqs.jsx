'use client'
import React, { useContext, useState } from 'react'
import { Context } from '../helper/Context'
import { RiArrowDownSLine, RiQuestionFill } from 'react-icons/ri'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const Faqs = () => {
    const { faqs, } = useContext(Context)
    const [openId, setOpenId] = useState(null)

    const toggleFaq = (id) => {
        setOpenId(openId === id ? null : id)
    }

    return (
        <section className='w-full py-20 bg-white relative overflow-hidden'>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10">
                <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-[80px]"></div>
                <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500/5 rounded-full blur-[80px]"></div>
            </div>

            <div className='container-custom flex flex-col items-center space-y-16'>
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className='text-center space-y-4 max-w-3xl'
                >
                    <span className='text-emerald-600 font-bold tracking-[0.4em] uppercase text-[10px] block'>Knowledge Base</span>
                    <h2 className='text-4xl md:text-5xl font-bold text-slate-900 tracking-tighter leading-tight'>
                        Got Questions? <span className="text-emerald-500">Answers</span> Here.
                    </h2>
                    <p className="text-slate-500 font-medium text-base leading-relaxed">
                        Explore our frequently asked questions to learn more about our process, technology, and commitment to your business success.
                    </p>
                </motion.div>

                <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-start'>
                    {faqs && faqs.length > 0 && faqs.map((faq, idx) => (
                        <motion.div 
                            key={faq.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                            className={`w-full flex flex-col overflow-hidden border transition-all duration-500 rounded-xl ${openId === faq.id ? 'bg-white border-emerald-500/20 shadow-xl' : 'bg-slate-50 border-slate-100 hover:border-slate-200'}`}
                        >
                            <button 
                                onClick={() => toggleFaq(faq.id)}
                                className='w-full p-6 md:p-8 flex flex-row items-center justify-between text-left group'
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${openId === faq.id ? 'bg-emerald-500 text-white rotate-6' : 'bg-white text-slate-400 group-hover:text-emerald-500'}`}>
                                        <RiQuestionFill size={20} />
                                    </div>
                                    <p className={`text-base font-bold tracking-tight transition-colors ${openId === faq.id ? 'text-slate-900' : 'text-slate-700'}`}>
                                        {faq.question}
                                    </p>
                                </div>
                                <div className={`shrink-0 transition-transform duration-500 ${openId === faq.id ? 'rotate-180 text-emerald-500' : 'text-slate-300'}`}>
                                    <RiArrowDownSLine size={24} />
                                </div>
                            </button>

                            <AnimatePresence>
                                {openId === faq.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.4, ease: "easeInOut" }}
                                    >
                                        <div className='px-6 md:px-8 pb-8 pt-2'>
                                            <div className="h-px w-full bg-slate-100 mb-6" />
                                            <p className='text-slate-500 font-medium leading-relaxed text-sm'>
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                {/* Footer CTA */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="pt-8"
                >
                    <div className="bg-slate-900 text-white px-8 py-6 rounded-xl flex flex-col md:flex-row items-center gap-6 shadow-xl">
                        <p className="font-bold text-base">Still have questions?</p>
                        <Link href="/user/tickets" className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold uppercase tracking-widest text-[10px] rounded-lg transition-all">
                            Contact Support
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default Faqs
