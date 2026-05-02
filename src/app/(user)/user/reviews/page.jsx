'use client'
import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import DataTable from '@/component/dashboard/DataTable'
import { Context } from '@/component/helper/Context'
import { RiStarFill, RiDeleteBin6Line, RiCloseLine, RiChatQuoteLine } from 'react-icons/ri'
import toast from 'react-hot-toast'

const ClientReviews = () => {
    const { isLoggedIn } = useContext(Context)
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    
    const [formData, setFormData] = useState({
        rating: 5,
        comment: ''
    })

    const fetchReviews = async () => {
        try {
            const res = await axios.get('/api/user/review')
            setReviews(res.data.data)
        } catch (error) {
            console.error('Failed to fetch reviews', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isLoggedIn) fetchReviews()
    }, [isLoggedIn])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            const res = await axios.post('/api/user/review', {
                rating: formData.rating,
                comment: formData.comment
            })
            if (res.data.success) {
                toast.success('Review submitted for approval.')
                setIsModalOpen(false)
                setFormData({ rating: 5, comment: '' })
                fetchReviews()
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Submission failed.')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this review?')) return
        try {
            const res = await axios.delete(`/api/user/review?id=${id}`)
            if (res.data.success) {
                toast.success('Review removed.')
                fetchReviews()
            }
        } catch (error) {
            toast.error('Deletion failed.')
        }
    }

    const columns = [
        { label: 'Rating', key: 'rate', render: (row) => (
            <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <RiStarFill key={i} className={i < row.rate ? 'text-slate-800' : 'text-slate-200'} size={12} />
                ))}
            </div>
        )},
        { label: 'Comment', key: 'comment', render: (row) => (
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tight max-w-xs truncate">&quot;{row.comment}&quot;</p>
        )},
        { label: 'Status', key: 'isApproved', render: (row) => (
            <span className={`px-2 py-0.5 border text-[9px] font-bold uppercase tracking-widest
                ${row.is_approved ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                {row.is_approved ? 'Visible' : 'Pending'}
            </span>
        )},
        { label: 'Date', key: 'created_at', render: (row) => (
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(row.created_at).toLocaleDateString()}</span>
        )},
    ]

    const actions = (row) => (
        <button
            onClick={() => handleDelete(row.review_id)}
            className="p-1.5 border border-slate-200 text-slate-400 hover:text-red-500 transition-all"
            title="Delete"
        >
            <RiDeleteBin6Line size={16} />
        </button>
    )

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Reviews</h1>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Manage your platform testimonials.</p>
                </div>
                {reviews.length === 0 ? (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-slate-900 text-white px-4 py-2 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all"
                    >
                        Post Review
                    </button>
                ) : (
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest border border-slate-200 bg-slate-50 px-3 py-2">
                        Delete review to post a new one
                    </span>
                )}
            </div>

            <div className="bg-white border border-slate-200 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={reviews}
                    loading={loading}
                    actions={actions}
                />
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
                    <div className="bg-white w-full max-w-md border border-slate-200 overflow-hidden">
                        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                            <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Submit Testimonial</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-800 transition-colors">
                                <RiCloseLine size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Experience Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <button
                                            key={num}
                                            type="button"
                                            onClick={() => setFormData({...formData, rating: num})}
                                            className="transition-all active:scale-90"
                                        >
                                            <RiStarFill size={28} className={num <= formData.rating ? 'text-slate-800' : 'text-slate-200'} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Your Comments</label>
                                <textarea
                                    placeholder="Describe your experience..."
                                    value={formData.comment}
                                    onChange={(e) => setFormData({...formData, comment: e.target.value})}
                                    required
                                    rows={4}
                                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 text-xs font-bold focus:outline-none focus:border-slate-400 transition-all resize-none"
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-2.5 border border-slate-200 text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 py-2.5 bg-slate-900 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50"
                                >
                                    {submitting ? 'Submitting...' : 'Post Review'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ClientReviews
