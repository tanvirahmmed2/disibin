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
                <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
            </div>
        )
    }

    const unreadCount = notifications.filter(n => !n.is_read).length

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Notifications</h1>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{unreadCount} unread message{unreadCount !== 1 ? 's' : ''}.</p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={() => markAsRead()}
                        className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-400 text-[9px] font-bold uppercase tracking-widest transition-all"
                    >
                        <RiCheckDoubleLine size={14} />
                        Mark All Read
                    </button>
                )}
            </div>

            <div className="space-y-2">
                {notifications.length === 0 ? (
                    <div className="p-16 bg-white border border-slate-200 text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No Notifications</p>
                        <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest mt-1">You&apos;re all caught up.</p>
                    </div>
                ) : (
                    notifications.map((notif) => (
                        <div
                            key={notif.notification_id}
                            className={`p-5 bg-white border flex gap-4 transition-all ${notif.is_read ? 'border-slate-100 opacity-60' : 'border-slate-300'}`}
                        >
                            <div className={`w-8 h-8 shrink-0 border flex items-center justify-center ${notif.is_read ? 'border-slate-200 bg-slate-50 text-slate-400' : 'border-slate-900 bg-slate-900 text-white'}`}>
                                <RiNotification3Line size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-4 mb-1">
                                    <h3 className={`text-xs font-bold uppercase tracking-tight leading-none ${notif.is_read ? 'text-slate-500' : 'text-slate-900'}`}>
                                        {notif.title}
                                    </h3>
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 shrink-0">
                                        {new Date(notif.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight leading-relaxed mt-1 mb-3">
                                    {notif.message}
                                </p>
                                <div className="flex items-center gap-4">
                                    {!notif.is_read && (
                                        <button
                                            onClick={() => markAsRead(notif.notification_id)}
                                            className="text-[9px] font-bold text-slate-900 uppercase tracking-widest hover:underline"
                                        >
                                            Mark Read
                                        </button>
                                    )}
                                    {notif.link && (
                                        <Link href={notif.link} className="flex items-center gap-1 text-[9px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors">
                                            View Details <RiExternalLinkLine size={12} />
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
