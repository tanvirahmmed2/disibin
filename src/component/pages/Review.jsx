'use client'
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RiDoubleQuotesL, RiStarFill } from 'react-icons/ri'

const Review = () => {
    const [reviews, setReviews] = useState([])
    const [index, setIndex] = useState(0)
    const [direction, setDirection] = useState(0)

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const res = await axios.get('/api/review/approved', { withCredentials: true })
                
                const data = res.data.data || []
                const sorted = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10)
                setReviews(sorted)
            } catch (error) {
                setReviews([])
            }
        }
        fetchReview()
    }, [])

    const nextStep = useCallback(() => {
        setDirection(1)
        setIndex((prev) => (prev + 1) % reviews.length)
    }, [reviews.length])

    const prevStep = useCallback(() => {
        setDirection(-1)
        setIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
    }, [reviews.length])

    useEffect(() => {
        if (!reviews || reviews.length === 0) return
        const timer = setInterval(nextStep, 6000)
        return () => clearInterval(timer)
    }, [reviews, nextStep])

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 200 : -200,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 200 : -200,
            opacity: 0,
            scale: 0.95
        })
    }

    if (!reviews || reviews.length === 0) return null

    return (
        <section className='w-full py-12 bg-white relative overflow-hidden'>
            {/* Subtle Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] -ml-32 -mb-32"></div>

            <div className='container-custom flex flex-col items-center justify-center space-y-8 relative px-4'>
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className='text-center space-y-2'
                >
                    <span className='text-emerald-600 font-bold tracking-[0.3em] uppercase text-[9px] block'>Client Feedback</span>
                    <h2 className='text-2xl md:text-3xl font-bold text-slate-900 tracking-tight'>
                        Real Results. <span className="text-slate-400">Real Stories.</span>
                    </h2>
                </motion.div>

                <div className='w-full max-w-2xl relative min-h-[400px] md:min-h-[350px] flex items-center justify-center'>
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                            key={index}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.3 },
                                scale: { duration: 0.3 }
                            }}
                            className='absolute w-full'
                        >
                            <div className='bg-slate-50/50 border border-slate-100 p-5 md:p-8 rounded-2xl flex flex-col gap-6 relative group transition-all hover:border-emerald-500/20'>
                                <RiDoubleQuotesL className="text-emerald-500/20 transition-colors group-hover:text-emerald-500/40" size={32} />
                                
                                <div className='space-y-5'>
                                    {/* Stars */}
                                    <div className="flex gap-0.5 text-amber-400">
                                        {[...Array(5)].map((_, i) => (
                                            <RiStarFill key={i} size={14} className={i < reviews[index].rating ? 'text-amber-400' : 'text-slate-200'} />
                                        ))}
                                    </div>

                                    <p className='text-base md:text-lg font-medium text-slate-700 leading-relaxed italic'>
                                        &quot;{reviews[index].comment}&quot;
                                    </p>

                                    {/* Author Info Area - Card Like */}
                                    <div className="flex items-center gap-4 pt-5 border-t border-slate-100">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 text-emerald-500 font-bold text-sm flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 transition-all">
                                            {reviews[index].user_name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold text-slate-800">{reviews[index].user_name}</p>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Verified Client</p>
                                        </div>
                                        <p className="ml-auto text-[10px] font-bold uppercase tracking-widest text-slate-300">
                                            {new Date(reviews[index].created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Simplified Controls */}
                <div className='flex items-center gap-6'>
                    <div className='flex items-center gap-2'>
                        {reviews.map((_, i) => (
                            <button 
                                key={i} 
                                onClick={() => {
                                    setDirection(i > index ? 1 : -1)
                                    setIndex(i)
                                }}
                                className={`h-1 rounded-full transition-all duration-500 ${i === index ? 'w-6 bg-emerald-500 shadow-sm' : 'w-1.5 bg-slate-200 hover:bg-slate-300'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Review
