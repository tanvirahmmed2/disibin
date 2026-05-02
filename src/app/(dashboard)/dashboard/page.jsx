'use client'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { Context } from '@/component/helper/Context'
import { useRouter } from 'next/navigation'
import {
    RiUserFollowLine,
    RiMoneyDollarCircleLine,
    RiTicketLine,
    RiTaskLine,
    RiProjectorLine,
    RiArticleLine,
    RiCustomerService2Line,
    RiDashboardLine,
    RiPriceTag3Line,
    RiShieldFlashLine,
    RiCheckDoubleLine,
    RiArrowRightSLine,
    RiBuildingLine,
    RiTimeLine,
} from 'react-icons/ri'

const ICON_MAP = {
    users:    RiUserFollowLine,
    packages: RiPriceTag3Line,
    blogs:    RiArticleLine,
    projects: RiProjectorLine,
    tasks:    RiTaskLine,
    tickets:  RiTicketLine,
    tenants:  RiBuildingLine,
    subs:     RiShieldFlashLine,
}

const STATUS_STYLES = {
    open:        'text-amber-600 bg-amber-50 border-amber-200',
    in_progress: 'text-blue-600 bg-blue-50 border-blue-200',
    resolved:    'text-emerald-600 bg-emerald-50 border-emerald-200',
    closed:      'text-slate-500 bg-slate-50 border-slate-200',
    active:      'text-emerald-600 bg-emerald-50 border-emerald-200',
    expired:     'text-red-600 bg-red-50 border-red-200',
}

const DashboardHome = () => {
    const router = useRouter()
    const { userData } = useContext(Context)
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const role = userData?.role || 'user'

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('/api/dashboard/stats')
                setStats(res.data.data)
            } catch {}
            finally { setLoading(false) }
        }
        if (userData?.user_id) fetchStats()
    }, [userData])

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
        </div>
    )

    const overview = stats?.overview || []
    const recentTickets = stats?.recent?.tickets || []
    const recentSubs = stats?.recent?.subscriptions || []
    const assignedTickets = stats?.assignedTickets || []

    return (
        <div className="space-y-6">

            {/* ── Header ─────────────────────────────────────────────── */}
            <div className="border-b border-slate-200 pb-4 flex items-end justify-between">
                <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">
                        {role === 'user'
                            ? `Welcome, ${userData?.name?.split(' ')[0] || 'User'}`
                            : role === 'admin' ? 'System Overview'
                            : 'Operations Hub'}
                    </h1>
                </div>
                {role !== 'user' && (
                    <button
                        onClick={() => router.push(`/dashboard/${role.replace('_', '-')}`)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 text-white text-[9px] font-bold uppercase tracking-widest hover:bg-slate-700 transition-all"
                    >
                        <RiDashboardLine size={12} />
                        {role.charAt(0).toUpperCase() + role.slice(1)} Panel
                        <RiArrowRightSLine size={12} />
                    </button>
                )}
            </div>

            {/* ── Stat Grid ──────────────────────────────────────────── */}
            {overview.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {overview.map((stat, i) => {
                        const Icon = ICON_MAP[stat.type] || RiDashboardLine
                        return (
                            <div key={i} className="bg-white border border-slate-200 p-4 group hover:border-slate-400 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 group-hover:border-slate-800 group-hover:text-slate-800 transition-all shrink-0">
                                        <Icon size={15} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">{stat.title}</p>
                                        <p className="text-lg font-bold text-slate-900 leading-none mt-0.5">{stat.value ?? 0}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* ── Role-specific content ───────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Left / Wide column */}
                <div className="lg:col-span-2 space-y-4">

                    {/* USER — Quick Actions */}
                    {role === 'user' && (
                        <div className="bg-white border border-slate-200">
                            <div className="px-5 py-3 border-b border-slate-100">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Quick Access</p>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-100">
                                {[
                                    { label: 'Support',      href: '/dashboard/tickets',      icon: RiTicketLine },
                                    { label: 'Orders',       href: '/dashboard/purchases',    icon: RiPriceTag3Line },
                                    { label: 'Subscription', href: '/dashboard/subscription', icon: RiShieldFlashLine },
                                    { label: 'Reviews',      href: '/dashboard/reviews',      icon: RiUserFollowLine },
                                ].map((link, i) => (
                                    <button
                                        key={i}
                                        onClick={() => router.push(link.href)}
                                        className="flex flex-col items-center justify-center py-6 gap-2 group hover:bg-slate-50 transition-all"
                                    >
                                        <div className="w-9 h-9 border border-slate-200 bg-white flex items-center justify-center text-slate-400 group-hover:border-slate-800 group-hover:text-slate-800 transition-all">
                                            <link.icon size={16} />
                                        </div>
                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-900 transition-all">{link.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* USER — Recent Tickets */}
                    {role === 'user' && recentTickets.length > 0 && (
                        <div className="bg-white border border-slate-200">
                            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Recent Tickets</p>
                                <button onClick={() => router.push('/dashboard/tickets')} className="text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 flex items-center gap-1 transition-all">
                                    View all <RiArrowRightSLine size={11} />
                                </button>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {recentTickets.map(t => (
                                    <div key={t.ticket_id} className="px-5 py-3 flex items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] font-bold text-slate-900 uppercase tracking-tight truncate">{t.subject}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 flex items-center gap-1">
                                                <RiTimeLine size={9} />
                                                {new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-0.5 border text-[8px] font-bold uppercase tracking-widest shrink-0 ${STATUS_STYLES[t.status] || STATUS_STYLES.open}`}>
                                            {t.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* USER — Recent Subscriptions */}
                    {role === 'user' && recentSubs.length > 0 && (
                        <div className="bg-white border border-slate-200">
                            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Subscriptions</p>
                                <button onClick={() => router.push('/dashboard/subscription')} className="text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 flex items-center gap-1 transition-all">
                                    View all <RiArrowRightSLine size={11} />
                                </button>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {recentSubs.map(s => (
                                    <div key={s.subscription_id} className="px-5 py-3 flex items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] font-bold text-slate-900 uppercase tracking-tight truncate">{s.package_name}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                                Expires {s.expire_date ? new Date(s.expire_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-0.5 border text-[8px] font-bold uppercase tracking-widest shrink-0 ${STATUS_STYLES[s.status] || STATUS_STYLES.active}`}>
                                            {s.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STAFF — Assigned Tickets */}
                    {role !== 'user' && role !== 'admin' && assignedTickets.length > 0 && (
                        <div className="bg-white border border-slate-200">
                            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Your Assigned Tickets</p>
                                <button onClick={() => router.push('/dashboard/tickets')} className="text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 flex items-center gap-1 transition-all">
                                    View all <RiArrowRightSLine size={11} />
                                </button>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {assignedTickets.map(t => (
                                    <div key={t.ticket_id} className="px-5 py-3 flex items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] font-bold text-slate-900 uppercase tracking-tight truncate">{t.subject}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                                {new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className={`px-2 py-0.5 border text-[8px] font-bold uppercase tracking-widest ${
                                                t.priority === 'urgent' ? 'text-red-600 bg-red-50 border-red-200' :
                                                t.priority === 'high' ? 'text-orange-600 bg-orange-50 border-orange-200' :
                                                'text-slate-500 bg-slate-50 border-slate-200'}`}>
                                                {t.priority}
                                            </span>
                                            <span className={`px-2 py-0.5 border text-[8px] font-bold uppercase tracking-widest ${STATUS_STYLES[t.status] || STATUS_STYLES.open}`}>
                                                {t.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ADMIN — Navigation shortcuts */}
                    {role === 'admin' && (
                        <div className="bg-white border border-slate-200">
                            <div className="px-5 py-3 border-b border-slate-100">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Admin Shortcuts</p>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-100">
                                {[
                                    { label: 'Users',    href: '/dashboard/admin/users',         icon: RiUserFollowLine },
                                    { label: 'Tenants',  href: '/dashboard/manager/tenants',      icon: RiBuildingLine },
                                    { label: 'Packages', href: '/dashboard/manager/packages',     icon: RiPriceTag3Line },
                                    { label: 'Tickets',  href: '/dashboard/manager/tickets',      icon: RiTicketLine },
                                ].map((link, i) => (
                                    <button
                                        key={i}
                                        onClick={() => router.push(link.href)}
                                        className="flex flex-col items-center justify-center py-6 gap-2 group hover:bg-slate-50 transition-all"
                                    >
                                        <div className="w-9 h-9 border border-slate-200 bg-white flex items-center justify-center text-slate-400 group-hover:border-slate-800 group-hover:text-slate-800 transition-all">
                                            <link.icon size={16} />
                                        </div>
                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-900 transition-all">{link.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right column */}
                <div className="space-y-4">

                    {/* System Status */}
                    <div className="bg-white border border-slate-200">
                        <div className="px-5 py-3 border-b border-slate-100">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">System Status</p>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {[
                                { label: 'Database',   ok: true },
                                { label: 'Auth Layer', ok: true },
                                { label: 'API Server', ok: true },
                                { label: 'Storage',    ok: true },
                            ].map(s => (
                                <div key={s.label} className="px-5 py-2.5 flex items-center justify-between">
                                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{s.label}</span>
                                    <div className="flex items-center gap-1.5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${s.ok ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                        <span className={`text-[8px] font-bold uppercase tracking-widest ${s.ok ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {s.ok ? 'Operational' : 'Down'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="px-5 py-3 border-t border-slate-100 flex items-center gap-2">
                            <RiCheckDoubleLine size={12} className="text-emerald-500" />
                            <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">All Systems Operational</p>
                        </div>
                    </div>

                    {/* Support CTA */}
                    <div className="bg-slate-900 border border-slate-800">
                        <div className="p-5">
                            <div className="w-8 h-8 border border-slate-700 bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
                                <RiCustomerService2Line size={16} />
                            </div>
                            <h3 className="text-[10px] font-bold text-white uppercase tracking-tight mb-1">Need Help?</h3>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed mb-4">
                                Our support team is ready to assist you with any issues.
                            </p>
                            <button
                                onClick={() => router.push('/dashboard/tickets')}
                                className="w-full py-2.5 bg-white text-slate-900 text-[9px] font-bold uppercase tracking-widest hover:bg-slate-100 transition-all"
                            >
                                Open a Ticket
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardHome
