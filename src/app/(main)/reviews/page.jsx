'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { RiStarFill, RiStarLine } from 'react-icons/ri'
import Link from 'next/link'

const ReviewsPage = () => {
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get('/api/review/approved')
                setReviews(res.data.data)
            } catch (error) {
                console.error('Failed to fetch reviews', error)
            } finally {
                setLoading(false)
            }
        }
        fetchReviews()
    }, [])

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin"></div>
        </div>
    )

    return (
        <div className="min-h-screen bg-white py-16 px-6">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="mb-12">
                    <p className="text-sm text-emerald-600 mb-2">Client Feedback</p>
                    <h1 className="text-3xl text-slate-900 mb-3">What people say</h1>
                    <p className="text-slate-400 text-sm max-w-md">
                        Honest reviews from our clients about their experience working with us.
                    </p>
                </div>

                {/* Grid */}
                {reviews.length === 0 ? (
                    <div className="py-24 text-center">
                        <p className="text-slate-400 text-sm">No reviews yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {reviews.map((review) => (
                            <div
                                key={review.review_id}
                                className="bg-slate-50 rounded-2xl p-6 hover:bg-slate-100 transition-colors"
                            >
                                {/* Stars */}
                                <div className="flex gap-0.5 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        i < review.rating
                                            ? <RiStarFill key={i} size={14} className="text-amber-400" />
                                            : <RiStarLine key={i} size={14} className="text-slate-300" />
                                    ))}
                                </div>

                                {/* Comment */}
                                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                    &quot;{review.comment}&quot;
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 text-xs flex items-center justify-center">
                                        {review.user_name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-700">{review.user_name}</p>
                                        <p className="text-xs text-slate-400">
                                            {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* CTA */}
                <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <p className="text-sm text-slate-500">Enjoyed working with us? Share your experience.</p>
                    <Link
                        href="/user/reviews"
                        className="text-sm text-emerald-600 hover:text-emerald-700 underline underline-offset-4 transition-colors"
                    >
                        Leave a review →
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ReviewsPage
