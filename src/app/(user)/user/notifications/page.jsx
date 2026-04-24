'use client'
import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Context } from '@/component/helper/Context'
import { RiNotification3Line, RiCheckDoubleLine, RiExternalLinkLine } from 'react-icons/ri'
import Link from 'next/link'

const UserNotifications = () => {
    const { userData } = useContext(Context)
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchNotifications = async () => {
        try {
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
        if (userData?.user_id) fetchNotifications()
    }, [userData])

    const markAsRead = async (id = null) => {
        try {
            const res = await axios.patch('/api/notification', { id }, { withCredentials: true })
            if (res.data.success) {
                fetchNotifications()
            }
        } catch (error) {
            toast.error('Failed to mark notification as read')
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
        )
    }

    const unreadCount = notifications.filter(n => !n.is_read).length

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Notifications</h1>
                    <p className="text-slate-500 mt-1 font-medium">You have {unreadCount} unread messages.</p>
                </div>
                {unreadCount > 0 && (
                    <button 
                        onClick={() => markAsRead()}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 hover:text-emerald-600 rounded-xl text-sm font-semibold transition-all"
                    >
                        <RiCheckDoubleLine size={18} />
                        Mark all as read
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="p-16 bg-white border border-slate-100 rounded-3xl text-center shadow-sm">
                        <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                            <RiNotification3Line size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">All Caught Up</h3>
                        <p className="text-slate-500 font-medium">You have no new notifications.</p>
                    </div>
                ) : (
                    notifications.map((notif) => (
                        <div 
                            key={notif.notification_id} 
                            className={`p-6 bg-white border rounded-2xl transition-all flex gap-4 ${notif.is_read ? 'border-slate-100 opacity-70' : 'border-emerald-100 shadow-sm'}`}
                        >
                            <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center ${notif.is_read ? 'bg-slate-50 text-slate-400' : 'bg-emerald-50 text-emerald-500'}`}>
                                <RiNotification3Line size={24} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between gap-4 mb-1">
                                    <h3 className={`text-lg font-bold ${notif.is_read ? 'text-slate-700' : 'text-slate-900'}`}>
                                        {notif.title}
                                    </h3>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 shrink-0">
                                        {new Date(notif.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-slate-500 font-medium leading-relaxed mb-3">
                                    {notif.message}
                                </p>
                                <div className="flex items-center gap-4">
                                    {!notif.is_read && (
                                        <button 
                                            onClick={() => markAsRead(notif.notification_id)}
                                            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-widest"
                                        >
                                            Mark Read
                                        </button>
                                    )}
                                    {notif.link && (
                                        <Link href={notif.link} className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-colors">
                                            View Details <RiExternalLinkLine size={14} />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default UserNotifications
