'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { RiStarFill, RiStarLine, RiDoubleQuotesL, RiUserHeartLine } from 'react-icons/ri'
import Link from 'next/link'

const ReviewsPage = () => {
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get('/api/review/approved')
                setReviews(res.data.data || [])
            } catch (error) {
                console.error('Failed to fetch reviews', error)
            } finally {
                setLoading(false)
            }
        }
        fetchReviews()
    }, [])

    const avgRating = reviews.length
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : null

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-10 h-10 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin" />
        </div>
    )

    return (
        <div className="w-full min-h-screen bg-white">

            {/* ── Hero ── */}
            <section className="w-full py-32 bg-slate-50/50 border-b border-slate-100">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        className="max-w-2xl"
                    >
                        <span className="text-emerald-600 font-semibold tracking-[0.4em] uppercase text-[10px] block mb-6">
                            Client Testimonials
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tighter leading-tight mb-6">
                            What our clients<br />
                            <span className="text-slate-400">actually say.</span>
                        </h1>
                        <p className="text-slate-600 font-medium leading-relaxed max-w-lg">
                            Unfiltered feedback from businesses and individuals who chose Disibin to power their digital growth.
                        </p>
                    </motion.div>

                    {/* Stats bar */}
                    {reviews.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="flex flex-wrap items-center gap-10 mt-12 pt-12 border-t border-slate-100"
                        >
                            <div>
                                <p className="text-4xl font-bold text-slate-900 tracking-tighter">{avgRating}</p>
                                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mt-1">Avg. Rating</p>
                            </div>
                            <div className="w-px h-10 bg-slate-100" />
                            <div>
                                <p className="text-4xl font-bold text-slate-900 tracking-tighter">{reviews.length}</p>
                                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mt-1">Total Reviews</p>
                            </div>
                            <div className="w-px h-10 bg-slate-100" />
                            <div className="flex gap-0.5 items-center">
                                {[...Array(5)].map((_, i) => (
                                    i < Math.round(avgRating)
                                        ? <RiStarFill key={i} className="text-amber-400" size={22} />
                                        : <RiStarLine key={i} className="text-slate-200" size={22} />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* ── Reviews Grid ── */}
            <section className="w-full py-24 bg-white">
                <div className="container-custom">
                    {reviews.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
                            <RiUserHeartLine size={48} className="text-slate-200" />
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                                No testimonials yet
                            </p>
                            <Link href="/user/reviews" className="mt-4 px-8 py-4 bg-slate-900 text-white font-semibold text-xs uppercase tracking-widest rounded-xl hover:bg-emerald-500 transition-all active:scale-95">
                                Be the first
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {reviews.map((review, idx) => (
                                <motion.div
                                    key={review.review_id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                                    className="p-8 bg-slate-50/50 border border-slate-100 rounded-2xl flex flex-col gap-6 hover:border-emerald-500/20 hover:shadow-sm transition-all group"
                                >
                                    {/* Quote icon */}
                                    <RiDoubleQuotesL className="text-emerald-500/30 group-hover:text-emerald-500/60 transition-colors" size={28} />

                                    {/* Stars */}
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            i < review.rating
                                                ? <RiStarFill key={i} size={14} className="text-amber-400" />
                                                : <RiStarLine key={i} size={14} className="text-slate-200" />
                                        ))}
                                    </div>

                                    {/* Comment */}
                                    <p className="text-slate-700 font-medium leading-relaxed flex-1">
                                        &quot;{review.comment}&quot;
                                    </p>

                                    {/* Author */}
                                    <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 text-emerald-500 font-bold text-sm flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 transition-all">
                                            {review.user_name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">{review.user_name}</p>
                                            <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-500">
                                                Verified Client
                                            </p>
                                        </div>
                                        <p className="ml-auto text-[10px] font-semibold uppercase tracking-widest text-slate-300">
                                            {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="w-full py-24 bg-slate-50/50 border-t border-slate-100">
                <div className="container-custom flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                    <div className="space-y-3">
                        <span className="text-emerald-600 font-semibold tracking-[0.4em] uppercase text-[10px]">Share Your Story</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tighter">
                            Had a great experience?
                        </h2>
                        <p className="text-slate-600 font-medium leading-relaxed max-w-md">
                            Help others make a confident decision by sharing your honest experience with Disibin.
                        </p>
                    </div>
                    <Link
                        href="/user/reviews"
                        className="flex-shrink-0 px-10 py-5 bg-slate-900 text-white font-semibold uppercase tracking-widest text-xs rounded-xl hover:bg-emerald-500 transition-all active:scale-95"
                    >
                        Submit a Review
                    </Link>
                </div>
            </section>
        </div>
    )
}

export default ReviewsPage
