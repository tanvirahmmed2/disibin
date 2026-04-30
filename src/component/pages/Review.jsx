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
            x: direction > 0 ? 500 : -500,
            opacity: 0,
            scale: 0.9
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 500 : -500,
            opacity: 0,
            scale: 0.9
        })
    }

    if (!reviews || reviews.length === 0) return null

    return (
        <section className='w-full py-20 bg-slate-50/30 relative overflow-hidden'>
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] -ml-48 -mb-48"></div>

            <div className='container-custom flex flex-col items-center justify-center space-y-12 relative'>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className='text-center space-y-4'
                >
                    <span className='text-emerald-500 font-bold tracking-[0.5em] uppercase text-[10px] block'>Testimonials</span>
                    <h2 className='text-4xl md:text-6xl font-bold text-slate-900 tracking-tighter leading-tight'>
                        What Our Clients <span className="text-emerald-500">Say.</span>
                    </h2>
                    <p className="text-slate-500 font-medium text-base max-w-xl mx-auto">
                        Real stories from business owners who transformed their operations with our digital solutions.
                    </p>
                </motion.div>

                <div className='w-full max-w-4xl relative min-h-[350px] flex items-center justify-center'>
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
                                opacity: { duration: 0.4 },
                                scale: { duration: 0.4 }
                            }}
                            className='absolute w-full'
                        >
                            <div className='bg-white border border-slate-100 p-8 md:p-12 rounded-[3rem] shadow-lg flex flex-col items-center text-center space-y-8 relative'>
                                <div className='absolute top-8 left-8 text-emerald-500/10'>
                                    <RiDoubleQuotesL size={60} />
                                </div>
                                
                                <div className='relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 shadow-xl border-4 border-white rotate-3 group'>
                                    <Image 
                                        src={reviews[index].user_image} 
                                        alt={reviews[index].user_name} 
                                        fill 
                                        className='object-cover grayscale group-hover:grayscale-0 transition-all duration-700'
                                    />
                                </div>
                                
                                <div className='space-y-6 relative z-10'>
                                    <div className="flex justify-center gap-1 text-emerald-500">
                                        {[...Array(5)].map((_, i) => (
                                            <RiStarFill key={i} size={16} />
                                        ))}
                                    </div>
                                    <p className='text-xl md:text-2xl font-bold text-slate-900 leading-relaxed italic tracking-tight'>
                                        &quot;{reviews[index].comment}&quot;
                                    </p>
                                    <div>
                                        <h4 className='font-bold text-slate-900 uppercase tracking-widest text-xs'>{reviews[index].user_name}</h4>
                                        <p className='text-emerald-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-1'>{reviews[index].user_email}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className='flex items-center gap-4 pt-6'>
                    <button 
                        onClick={prevStep}
                        className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-emerald-500 hover:text-emerald-500 transition-all"
                    >
                        <RiDoubleQuotesL className="rotate-180" size={16} />
                    </button>
                    <div className='flex items-center gap-2'>
                        {reviews.map((_, i) => (
                            <button 
                                key={i} 
                                onClick={() => {
                                    setDirection(i > index ? 1 : -1)
                                    setIndex(i)
                                }}
                                className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? 'w-8 bg-emerald-500 shadow-md shadow-emerald-500/20' : 'w-1.5 bg-slate-200 hover:bg-slate-300'}`}
                            />
                        ))}
                    </div>
                    <button 
                        onClick={nextStep}
                        className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-emerald-500 hover:text-emerald-500 transition-all"
                    >
                        <RiDoubleQuotesL size={16} />
                    </button>
                </div>
            </div>
        </section>
    )
}

export default Review
