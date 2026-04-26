'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { RiStarFill, RiChatQuoteLine, RiUserHeartLine, RiCheckDoubleLine } from 'react-icons/ri'
import Link from 'next/link'

const ReviewsPage = () => {
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get('/api/review')
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
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
    )

    return (
        <div className="min-h-screen w-full bg-slate-50 py-20 px-6">
            <div className="max-w-7xl mx-auto space-y-20">
                
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100 animate-bounce">
                        <RiUserHeartLine size={16} /> Wall of Love
                    </div>
                    <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none">
                        Our Community <br /> <span className="text-emerald-500">Feedback</span>
                    </h1>
                    <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                        Discover what our clients have to say about their journey with Disibin. Real stories from real people.
                    </p>
                </div>


                {reviews.length === 0 ? (
                    <div className="text-center py-20">
                        <RiChatQuoteLine size={80} className="mx-auto text-slate-200 mb-6" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest">No testimonials yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {reviews.map((review) => (
                            <div 
                                key={review.review_id}
                                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all group flex flex-col justify-between"
                            >
                                <div className="space-y-6">
                                    <div className="flex gap-1 text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <RiStarFill 
                                                key={i} 
                                                size={20} 
                                                className={i < review.rating ? 'fill-yellow-400' : 'fill-slate-100'} 
                                            />
                                        ))}
                                    </div>
                                    <p className="text-slate-600 font-medium italic leading-relaxed text-lg relative">
                                        <RiChatQuoteLine className="absolute -top-4 -left-4 text-emerald-50/50 w-12 h-12 -z-10" />
                                        &quot;{review.comment}&quot;
                                    </p>
                                </div>
                                
                                <div className="mt-10 pt-6 border-t border-slate-50 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center font-black text-xl uppercase group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                            {review.user_name?.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-800 tracking-tight">{review.user_name}</h4>
                                            <div className="flex items-center gap-1 text-emerald-500">
                                                <RiCheckDoubleLine size={14} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Verified Client</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                        {new Date(review.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -ml-20 -mb-20"></div>
                    
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Ready to share your story?</h2>
                    <p className="text-slate-400 text-lg font-medium max-w-xl mx-auto leading-relaxed">
                        Join our community of satisfied clients and help us improve our services with your valuable feedback.
                    </p>
                    <Link href={'/user/reviews'} className="px-10 py-5 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-600 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all active:scale-95">
                        Submit a Review
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ReviewsPage
