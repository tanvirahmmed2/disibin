'use client'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { Context } from '@/component/helper/Context'
import StatCard from '@/component/dashboard/StatCard'
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
    RiCheckDoubleLine
} from 'react-icons/ri'

const DashboardHome = () => {
    const { userData } = useContext(Context)
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const role = userData?.role || 'client'

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('/api/dashboard/stats')
                setStats(res.data.payload)
            } catch (error) {
                
            } finally {
                setLoading(false)
            }
        }
        if (userData?._id) fetchStats()
    }, [userData])

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-slate-100 border-t-emerald-600 rounded-full animate-spin"></div>
        </div>
    )

    const overview = stats?.overview || []

    return (
        <div className="max-w-7xl mx-auto py-8">
            <div className="mb-12">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                    {role === 'client' ? `Welcome, ${userData?.name?.split(' ')[0]}!` : 'System Overview'}
                </h1>
                <p className="text-slate-500 mt-2 font-medium">
                    {role === 'client' ? 'Manage your services, tickets, and professional profile.' : 'Track platform activity and manage system operations.'}
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                            RiDashboardLine
                        }
                        color={['emerald', 'blue', 'purple', 'amber'][index % 4]}
                    />
                ))}
            </div>

            {role !== 'client' && (
                <div className="mt-12 p-10 bg-emerald-600 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-2 text-center md:text-left">
                        <h2 className="text-3xl font-black tracking-tight">Access Control Panel</h2>
                        <p className="text-emerald-50 font-medium opacity-80">Navigate to your specific management tools.</p>
                    </div>
                    <a 
                        href={`/dashboard/${role.replace('_', '-')}`}
                        className="px-8 py-4 bg-white text-emerald-700 font-bold rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-3 active:scale-95"
                    >
                        Go to Dashboard <RiDashboardLine size={20} />
                    </a>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
                <div className="lg:col-span-2 space-y-8">
                    {role === 'client' && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'My Tickets', href: '/dashboard/tickets', icon: RiTicketLine, color: 'emerald' },
                                { label: 'Purchases', href: '/dashboard/purchases', icon: RiPriceTag3Line, color: 'blue' },
                                { label: 'Subscription', href: '/dashboard/subscription', icon: RiPriceTag3Line, color: 'purple' },
                                { label: 'Reviews', href: '/dashboard/reviews', icon: RiUserFollowLine, color: 'amber' },
                            ].map((link, i) => (
                                <a 
                                    key={i} 
                                    href={link.href}
                                    className="flex flex-col items-center justify-center p-6 bg-white border border-slate-100 rounded-3xl hover:border-emerald-500 hover:shadow-xl transition-all group"
                                >
                                    <div className={`w-12 h-12 rounded-2xl bg-${link.color}-50 text-${link.color}-600 flex items-center justify-center mb-3 group-hover:bg-slate-900 group-hover:text-white transition-all`}>
                                        <link.icon size={24} />
                                    </div>
                                    <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest">{link.label}</span>
                                </a>
                            ))}
                        </div>
                    )}

                    <div className="card-premium p-10">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Recent Activity</h3>
                        </div>
                        <div className="space-y-6">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                                        <RiTimeLine size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-800">System Activity {i + 1}</h4>
                                        <p className="text-sm text-slate-500">Log entry generated by automated task scheduler.</p>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-300 uppercase">Just now</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="card-premium p-10 bg-slate-900 text-white relative overflow-hidden">
                       <div className="relative z-10 space-y-6">
                          <div>
                            <h3 className="text-2xl font-black tracking-tight mb-2">Platform Support</h3>
                            <p className="text-slate-400 text-sm font-medium">Professional assistance is always available.</p>
                          </div>
                          <button onClick={() => window.location.href='/dashboard/tickets'} className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                              <RiCustomerService2Line size={20} /> Open Ticket
                          </button>
                       </div>
                    </div>

                    <div className="card-premium p-10 flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4">
                            <RiCheckDoubleLine size={24} />
                        </div>
                        <h3 className="font-bold text-slate-800">System Health</h3>
                        <p className="text-[10px] text-emerald-500 font-black mt-1 uppercase tracking-widest">Stable</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardHome



