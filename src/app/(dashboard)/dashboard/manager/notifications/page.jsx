'use client'
import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { RiNotification3Line, RiDeleteBinLine, RiSendPlaneLine } from 'react-icons/ri'

const ManagerNotifications = () => {
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)

    // Form state
    const [userId, setUserId] = useState('')
    const [title, setTitle] = useState('')
    const [message, setMessage] = useState('')
    const [link, setLink] = useState('')
    const [sending, setSending] = useState(false)

    const fetchNotifications = async () => {
        try {
            // Managers might see their own notifications, or we could fetch all. 
            // For now, let's just fetch their own (e.g. system alerts).
            const res = await axios.get('/api/notification', { withCredentials: true })
            if (res.data.success) {
                setNotifications(res.data.data)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchNotifications()
    }, [])

    const handleSendNotification = async (e) => {
        e.preventDefault()
        setSending(true)
        try {
            const data = {
                user_id: userId,
                title,
                message,
                link: link || null
            }
            const res = await axios.post('/api/notification', data, { withCredentials: true })
            if (res.data.success) {
                toast.success('Notification sent successfully')
                setUserId('')
                setTitle('')
                setMessage('')
                setLink('')
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to send notification')
        } finally {
            setSending(false)
        }
    }

    const deleteNotification = async (id) => {
        if (!confirm('Are you sure you want to delete this notification?')) return
        try {
            const res = await axios.delete('/api/notification', { data: { id }, withCredentials: true })
            if (res.data.success) {
                toast.success('Notification deleted')
                fetchNotifications()
            }
        } catch (error) {
            toast.error('Failed to delete notification')
        }
    }

    return (
        <div className="max-w-7xl mx-auto py-8">
            <div className="mb-10">
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Notification Center</h1>
                <p className="text-slate-500 mt-2 font-medium">Manage alerts and send notifications to users.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Send Notification Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm sticky top-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <RiSendPlaneLine className="text-emerald-500" /> Send Alert
                        </h2>
                        
                        <form onSubmit={handleSendNotification} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">User ID</label>
                                <input 
                                    type="number" 
                                    required
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    placeholder="e.g. 12"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-emerald-500 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Title</label>
                                <input 
                                    type="text" 
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Important Update"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-emerald-500 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Message</label>
                                <textarea 
                                    required
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Your purchase has been verified..."
                                    rows="4"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Link (Optional)</label>
                                <input 
                                    type="text" 
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    placeholder="/user/subscription"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-emerald-500 transition-colors"
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={sending}
                                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 mt-4"
                            >
                                {sending ? 'Sending...' : 'Send Notification'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Manager's Inbox (System Alerts) */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">System Inbox</h2>
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-widest">
                                {notifications.length} Alerts
                            </span>
                        </div>

                        {loading ? (
                            <div className="p-10 flex justify-center">
                                <div className="w-8 h-8 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin"></div>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-16 text-center">
                                <RiNotification3Line size={48} className="mx-auto text-slate-200 mb-4" />
                                <h3 className="text-lg font-bold text-slate-900">No system alerts</h3>
                                <p className="text-slate-500 font-medium">You&apos;re all caught up.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {notifications.map((notif) => (
                                    <div key={notif.notification_id} className="p-6 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                                        <div className="w-10 h-10 shrink-0 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center">
                                            <RiNotification3Line size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="text-base font-bold text-slate-900">{notif.title}</h3>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                    {new Date(notif.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-slate-600 mb-2">
                                                {notif.message}
                                            </p>
                                        </div>
                                        <button 
                                            onClick={() => deleteNotification(notif.notification_id)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <RiDeleteBinLine size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManagerNotifications
