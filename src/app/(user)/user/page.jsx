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
        <div className="max-w-6xl mx-auto py-8 px-4 space-y-10">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        {role === 'user' ? `Hello, ${userData?.name?.split(' ')[0]}!` : 'System Dashboard'}
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {role === 'user' ? 'Manage your services and support tickets.' : 'Global system metrics and administrative control.'}
                    </p>
                </div>
                {role === 'user' && (
                    <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg text-xs font-semibold border border-emerald-100">
                        {recent.subscriptions.length} Active Services
                    </div>
                )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {role === 'user' && (
                        <div className="space-y-4">
                            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">Quick Access</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Support', href: '/user/tickets', icon: RiTicketLine },
                                    { label: 'Orders', href: '/user/purchases', icon: RiPriceTag3Line },
                                    { label: 'Status', href: '/user/subscription', icon: RiShieldFlashLine },
                                    { label: 'Reviews', href: '/user/reviews', icon: RiUserFollowLine },
                                ].map((link, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => router.push(link.href)}
                                        className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 hover:shadow-md transition-all group"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-3 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                            <link.icon size={24} />
                                        </div>
                                        <span className="text-xs font-semibold text-slate-600 group-hover:text-emerald-600 transition-colors">{link.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {role === 'user' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Services</h2>
                                <button onClick={() => router.push('/user/subscription')} className="text-xs font-semibold text-emerald-600 hover:underline">View All</button>
                            </div>
                            <div className="space-y-3">
                                {recent.subscriptions.length === 0 ? (
                                    <div className="p-10 border border-dashed border-slate-200 rounded-2xl text-center">
                                        <p className="text-slate-400 text-sm">No active services found</p>
                                    </div>
                                ) : recent.subscriptions.map((sub, i) => (
                                    <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between hover:border-emerald-200 transition-all shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center font-semibold">
                                                {sub.package_name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-slate-800">{sub.package_name}</h4>
                                                <p className="text-[10px] text-slate-400 font-medium">Expires {new Date(sub.end_date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-semibold border border-emerald-100">Active</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-8">
                    <div className="p-8 bg-slate-900 text-white rounded-2xl relative overflow-hidden group">
                       <RiCustomerService2Line size={80} className="absolute top-0 right-0 p-4 text-white/5 pointer-events-none" />
                       <div className="relative z-10 space-y-4">
                          <h3 className="text-xl font-bold tracking-tight">Need Support?</h3>
                          <p className="text-slate-400 text-sm leading-relaxed">Our team is here to assist you with any technical needs.</p>
                          <button onClick={() => router.push('/user/tickets')} className="w-full py-3 bg-emerald-500 text-white font-semibold text-sm rounded-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-2">
                              Open Ticket
                          </button>
                       </div>
                    </div>

                    {role === 'user' && recent.tickets.length > 0 && (
                        <div className="space-y-4">
                             <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">Latest Tickets</h2>
                             <div className="space-y-3">
                                {recent.tickets.map((ticket, i) => (
                                    <div key={i} onClick={() => router.push(`/user/tickets`)} className="bg-white p-4 rounded-xl border border-slate-100 hover:shadow-sm cursor-pointer transition-all">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${ticket.status === 'open' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
                                                {ticket.status}
                                            </span>
                                            <span className="text-[10px] text-slate-400">{new Date(ticket.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <h5 className="text-sm font-semibold text-slate-700 truncate">{ticket.subject}</h5>
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
