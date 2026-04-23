'use client'
import React, { useState, useEffect, use } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { RiArrowLeftLine, RiUserLine, RiMailLine, RiQuestionLine, RiTimeLine, RiSendPlaneLine } from 'react-icons/ri'
import toast from 'react-hot-toast'

const MessageDetailPage = ({ params }) => {
    const { id } = use(params)
    const router = useRouter()
    const [message, setMessage] = useState(null)
    const [loading, setLoading] = useState(true)
    const [reply, setReply] = useState('')
    const [sending, setSending] = useState(false)

    const fetchMessage = async () => {
        try {
            const res = await axios.get(`/api/support/${id}`)
            if (res.data.success) {
                setMessage(res.data.data)
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            console.error('Failed to fetch message', error)
            toast.error('Failed to load message details')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMessage()
    }, [id])

    const handleSendReply = async () => {
        if (!reply.trim()) {
            toast.error('Please enter a reply message')
            return
        }

        setSending(true)
        try {
            const res = await axios.post('/api/support/reply', {
                id,
                reply,
                email: message.email,
                name: message.name,
                subject: message.subject
            })

            if (res.data.success) {
                toast.success('Reply sent successfully!')
                setReply('')
                fetchMessage() // Refresh to see updated status
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            console.error('Failed to send reply', error)
            toast.error('Failed to send reply')
        } finally {
            setSending(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!message) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <p className="text-slate-500 font-medium">Message not found</p>
                <button onClick={() => router.back()} className="text-primary font-bold flex items-center gap-2">
                    <RiArrowLeftLine /> Go Back
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 py-8">
            <div className="flex items-center justify-between px-4">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-medium text-sm"
                >
                    <RiArrowLeftLine size={18} /> Back
                </button>
                <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider
                    ${message.status === 'open' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {message.status}
                </span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h1 className="text-xl font-bold text-slate-800">{message.subject}</h1>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <RiUserLine className="text-slate-400" />
                            <span className="text-slate-600">{message.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <RiMailLine className="text-slate-400" />
                            <span className="text-slate-600">{message.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <RiTimeLine className="text-slate-400" />
                            <span className="text-slate-600">{new Date(message.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <p className="text-sm font-bold text-slate-500 mb-2">Message</p>
                    <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {message.message}
                    </div>
                </div>
            </div>

            {message.status !== 'closed' ? (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="font-bold text-slate-800">Reply</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <textarea
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            placeholder="Type your response..."
                            className="w-full min-h-[150px] p-4 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all text-slate-700 outline-none resize-none text-sm"
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={handleSendReply}
                                disabled={sending || !reply.trim()}
                                className="bg-primary text-white px-6 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {sending ? 'Sending...' : 'Send Reply'}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-slate-50 rounded-xl border border-dashed border-slate-200 p-8 text-center">
                    <p className="text-slate-500 font-medium text-sm">This message is closed and cannot be replied to.</p>
                </div>
            )}
        </div>
    )
}

export default MessageDetailPage
