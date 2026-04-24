'use client'
import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import DataTable from '@/component/dashboard/DataTable'
import { Context } from '@/component/helper/Context'
import { RiStarFill, RiDeleteBin6Line, RiCloseLine, RiChatQuoteLine } from 'react-icons/ri'
import toast from 'react-hot-toast'

const ClientReviews = () => {
    const { isLoggedin } = useContext(Context)
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
        if (isLoggedin) fetchReviews()
    }, [isLoggedin])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            const res = await axios.post('/api/user/review', formData)
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
            <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                    <RiStarFill key={i} className={i < row.rate ? 'text-yellow-400' : 'text-slate-100'} size={14} />
                ))}
            </div>
        )},
        { label: 'Comment', key: 'comment', render: (row) => (
            <p className="text-slate-600 text-sm italic max-w-xs truncate">"{row.comment}"</p>
        )},
        { label: 'Status', key: 'isApproved', render: (row) => (
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase
                ${row.is_approved ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                {row.is_approved ? 'Visible' : 'Pending'}
            </span>
        )},
        { label: 'Date', key: 'created_at', render: (row) => (
            <span className="text-slate-500 text-xs font-medium">{new Date(row.created_at).toLocaleDateString()}</span>
        )},
    ]

    const actions = (row) => (
        <button 
            onClick={() => handleDelete(row.review_id)}
            className="p-2 hover:bg-red-50 rounded-lg text-slate-300 hover:text-red-500 transition-all"
        >
            <RiDeleteBin6Line size={18} />
        </button>
    )

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Feedback</h1>
                    <p className="text-slate-500 text-sm">Manage your testimonials and platform experience reviews.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-slate-900/10 hover:bg-emerald-500 transition-all"
                >
                    Post Review
                </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <DataTable 
                    columns={columns} 
                    data={reviews} 
                    loading={loading} 
                    actions={actions} 
                />
            </div>


            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-800">Submit Testimonial</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <RiCloseLine size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Experience Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <button 
                                            key={num}
                                            type="button"
                                            onClick={() => setFormData({...formData, rating: num})}
                                            className="transition-all active:scale-90"
                                        >
                                            <RiStarFill size={32} className={num <= formData.rating ? 'text-yellow-400' : 'text-slate-100'} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Comments</label>
                                <textarea 
                                    placeholder="Describe your experience with our services..."
                                    value={formData.comment}
                                    onChange={(e) => setFormData({...formData, comment: e.target.value})}
                                    required
                                    className="input-standard h-32 resize-none"
                                />
                            </div>

                            <button 
                                type="submit" disabled={submitting}
                                className="w-full py-4 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {submitting ? 'Submitting...' : 'Post Testimonial'}
                                <RiChatQuoteLine size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ClientReviews
