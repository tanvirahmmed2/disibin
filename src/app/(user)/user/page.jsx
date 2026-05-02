'use client'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { Context } from '@/component/helper/Context'
import StatCard from '@/component/dashboard/StatCard'
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
    RiTimeLine,
    RiCheckDoubleLine,
    RiShieldFlashLine,
    RiSendPlane2Line
} from 'react-icons/ri'

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
            } catch (error) {
                
            } finally {
                setLoading(false)
            }
        }
        if (userData?.user_id) fetchStats()
    }, [userData])

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-10 h-10 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
    )

    const overview = stats?.overview || []
    const recent = stats?.recent || { tickets: [], subscriptions: [] }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">
                        {role === 'user' ? `Hello, ${userData?.name?.split(' ')[0]}` : 'System Dashboard'}
                    </h1>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                        {role === 'user' ? 'Manage your services and support tickets.' : 'Global system metrics and administrative control.'}
                    </p>
                </div>
                {role === 'user' && (
                    <span className="border border-emerald-200 bg-emerald-50 text-emerald-700 px-3 py-1 text-[9px] font-bold uppercase tracking-widest">
                        {recent.subscriptions.length} Active Services
                    </span>
                )}
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {overview.map((stat, index) => (
                    <StatCard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        icon={
                            stat.type === 'users' ? RiUserFollowLine :
                            stat.type === 'packages' ? RiPriceTag3Line :
                            stat.type === 'blogs' ? RiArticleLine :
                            stat.type === 'projects' ? RiProjectorLine :
                            stat.type === 'tasks' ? RiTaskLine :
                            stat.type === 'tickets' ? RiTicketLine :
                            stat.type === 'subs' ? RiShieldFlashLine :
                            RiDashboardLine
                        }
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Quick Access */}
                    {role === 'user' && (
                        <div className="space-y-3">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Quick Access</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {[
                                    { label: 'Support', href: '/user/tickets', icon: RiTicketLine },
                                    { label: 'Orders', href: '/user/purchases', icon: RiPriceTag3Line },
                                    { label: 'Status', href: '/user/subscription', icon: RiShieldFlashLine },
                                    { label: 'Reviews', href: '/user/reviews', icon: RiUserFollowLine },
                                ].map((link, i) => (
                                    <button
                                        key={i}
                                        onClick={() => router.push(link.href)}
                                        className="flex flex-col items-center justify-center py-6 px-4 bg-white border border-slate-200 hover:border-slate-900 hover:bg-slate-50 transition-all group"
                                    >
                                        <link.icon size={20} className="text-slate-400 group-hover:text-slate-900 mb-2 transition-colors" />
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">{link.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Active Services */}
                    {role === 'user' && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Services</p>
                                <button onClick={() => router.push('/user/subscription')} className="text-[9px] font-bold text-slate-900 uppercase tracking-widest hover:underline">View All</button>
                            </div>
                            <div className="space-y-2">
                                {recent.subscriptions.length === 0 ? (
                                    <div className="p-10 border border-slate-200 text-center">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No active services</p>
                                    </div>
                                ) : recent.subscriptions.map((sub, i) => (
                                    <div key={i} className="bg-white border border-slate-200 px-5 py-4 flex items-center justify-between hover:border-slate-400 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs uppercase">
                                                {sub.package_name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-xs uppercase tracking-tight leading-none mb-1">{sub.package_name}</p>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Expires {new Date(sub.end_date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <span className="border border-emerald-200 bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest">Active</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar widgets */}
                <div className="space-y-4">
                    <div className="bg-slate-900 text-white p-6 border border-slate-800">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-1">Need Support?</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed mb-4">Our team is here to help.</p>
                        <button onClick={() => router.push('/user/tickets')} className="w-full py-2.5 bg-white text-slate-900 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all">
                            Open Ticket
                        </button>
                    </div>

                    {role === 'user' && recent.tickets.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Latest Tickets</p>
                            <div className="space-y-2">
                                {recent.tickets.map((ticket, i) => (
                                    <div key={i} onClick={() => router.push(`/user/tickets`)} className="bg-white border border-slate-200 p-4 hover:border-slate-400 cursor-pointer transition-all">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className={`text-[9px] font-bold uppercase tracking-widest border px-2 py-0.5 ${ticket.status === 'open' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                                                {ticket.status}
                                            </span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(ticket.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-xs font-bold text-slate-700 truncate uppercase tracking-tight mt-2">{ticket.subject}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DashboardHome
