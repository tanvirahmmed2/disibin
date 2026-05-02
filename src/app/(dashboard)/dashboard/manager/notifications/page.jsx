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
        <div className="space-y-4">
            <div className="border-b border-slate-200 pb-4">
                <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Notification Center</h1>
                <p className="text-xs text-slate-500">Manage alerts and send notifications to users.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                
                {/* Send Notification Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 border border-slate-200 sticky top-4">
                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                            <RiSendPlaneLine size={16} /> Send Alert
                        </h2>
                        
                        <form onSubmit={handleSendNotification} className="space-y-4">
                            <div>
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">User ID</label>
                                <input 
                                    type="number" 
                                    required
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    placeholder="e.g. 12"
                                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2 text-xs font-bold focus:outline-none focus:border-slate-400 transition-all"
                                />
                            </div>

                            <div>
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Title</label>
                                <input 
                                    type="text" 
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Important Update"
                                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2 text-xs font-bold focus:outline-none focus:border-slate-400 transition-all"
                                />
                            </div>

                            <div>
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Message</label>
                                <textarea 
                                    required
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Your purchase has been verified..."
                                    rows="3"
                                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2 text-xs font-bold focus:outline-none focus:border-slate-400 transition-all resize-none"
                                />
                            </div>

                            <div>
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Link (Optional)</label>
                                <input 
                                    type="text" 
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    placeholder="/user/subscription"
                                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2 text-xs font-bold focus:outline-none focus:border-slate-400 transition-all"
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={sending}
                                className="w-full py-3 bg-slate-900 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all disabled:opacity-50"
                            >
                                {sending ? 'Sending...' : 'Send Notification'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Manager's Inbox (System Alerts) */}
                <div className="lg:col-span-2">
                    <div className="bg-white border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                            <h2 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">System Inbox</h2>
                            <span className="px-2 py-0.5 border border-slate-200 text-[9px] font-bold uppercase tracking-widest text-slate-500 bg-white">
                                {notifications.length} Alerts
                            </span>
                        </div>

                        {loading ? (
                            <div className="p-10 flex justify-center">
                                <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-16 text-center">
                                <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">No alerts</h3>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">You&apos;re all caught up.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {notifications.map((notif) => (
                                    <div key={notif.notification_id} className="p-6 flex items-start gap-4 hover:bg-slate-50 transition-all">
                                        <div className="w-8 h-8 border border-slate-200 text-slate-400 flex items-center justify-center shrink-0">
                                            <RiNotification3Line size={16} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-tight truncate leading-none">{notif.title}</h3>
                                                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                                                    {new Date(notif.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight leading-relaxed mt-1">
                                                {notif.message}
                                            </p>
                                        </div>
                                        <button 
                                            onClick={() => deleteNotification(notif.notification_id)}
                                            className="p-1.5 border border-slate-200 text-slate-400 hover:text-red-500 transition-all"
                                        >
                                            <RiDeleteBinLine size={16} />
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
