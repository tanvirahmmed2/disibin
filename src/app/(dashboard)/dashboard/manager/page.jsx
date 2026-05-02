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
    RiShieldFlashLine
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
            <div className="w-12 h-12 border-4 border-slate-50 border-t-primary rounded-full animate-spin"></div>
        </div>
    )

    const overview = stats?.overview || []

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="border-b border-slate-200 pb-6">
                <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">
                    {role === 'user' ? `Welcome, ${userData?.name?.split(' ')[0]}` : 'System Console'}
                </h1>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                    {role === 'user' ? 'Manage your services, tickets, and professional profile.' : 'Track platform activity and manage system operations.'}
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    />
                ))}
            </div>
            
            {role !== 'user' && (
                <div className="p-8 bg-slate-900 border border-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-1 text-center md:text-left">
                        <h2 className="text-sm font-bold tracking-wider uppercase">Management Console</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Navigate to your specialized role-based tools.</p>
                    </div>
                    <button 
                        onClick={() => router.push(`/dashboard/${role.replace('_', '-')}`)}
                        className="px-6 py-3 bg-white text-slate-900 font-bold uppercase tracking-widest text-[10px] border border-white hover:bg-slate-100 transition-all"
                    >
                        Access Panel
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {role === 'user' && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { label: 'Support', href: '/dashboard/tickets', icon: RiTicketLine },
                                { label: 'Orders', href: '/dashboard/purchases', icon: RiPriceTag3Line },
                                { label: 'Status', href: '/dashboard/subscription', icon: RiShieldFlashLine },
                                { label: 'Reviews', href: '/dashboard/reviews', icon: RiUserFollowLine },
                            ].map((link, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => router.push(link.href)}
                                    className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200 hover:border-slate-400 transition-all group"
                                >
                                    <div className="p-2 bg-slate-50 border border-slate-200 text-slate-400 mb-3 group-hover:text-slate-900 transition-all">
                                        <link.icon size={20} />
                                    </div>
                                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest group-hover:text-slate-900 transition-colors">{link.label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="p-8 bg-slate-50 border border-slate-200 relative overflow-hidden group">
                       <div className="relative z-10 space-y-6">
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Need Help?</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Our specialized support team is ready to assist you.</p>
                          </div>
                          <button onClick={() => router.push('/dashboard/tickets')} className="w-full py-3 bg-slate-900 text-white font-bold uppercase tracking-widest text-[10px] border border-slate-900 hover:bg-slate-800 transition-all">
                              Open Ticket
                          </button>
                       </div>
                    </div>

                    <div className="p-6 flex flex-col items-center text-center bg-white border border-slate-200">
                        <div className="w-8 h-8 bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center mb-3">
                            <RiCheckDoubleLine size={16} />
                        </div>
                        <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">System Integrity</h3>
                        <p className="text-[9px] text-emerald-600 font-bold mt-1 uppercase tracking-widest">Status: Optimized</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardHome



