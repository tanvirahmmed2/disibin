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
        <div className="max-w-7xl mx-auto py-8">
            <div className="mb-12">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                    {role === 'user' ? `Welcome back, ${userData?.name?.split(' ')[0]}!` : 'System Overview'}
                </h1>
                <p className="text-slate-500 mt-2 font-medium">
                    {role === 'user' ? 'Manage your services, tickets, and professional profile.' : 'Track platform activity and manage system operations.'}
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
                        color={['primary', 'indigo', 'violet', 'fuchsia'][index % 4]}
                    />
                ))}
            </div>
            
            {role !== 'user' && (
                <div className="mt-12 p-10 bg-emerald-500 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-primary/20">
                    <div className="space-y-2 text-center md:text-left">
                        <h2 className="text-3xl font-black tracking-tight uppercase">Management Console</h2>
                        <p className="text-white/80 font-medium opacity-80">Navigate to your specialized role-based tools.</p>
                    </div>
                    <button 
                        onClick={() => router.push(`/dashboard/${role.replace('_', '-')}`)}
                        className="px-10 py-5 bg-white text-emerald-500 font-black uppercase tracking-widest text-[11px] rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-3 active:scale-95 shadow-xl"
                    >
                        Access Panel <RiDashboardLine size={18} />
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
                <div className="lg:col-span-2 space-y-8">
                    {role === 'user' && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Support', href: '/dashboard/tickets', icon: RiTicketLine, color: 'primary' },
                                { label: 'Orders', href: '/dashboard/purchases', icon: RiPriceTag3Line, color: 'indigo' },
                                { label: 'Status', href: '/dashboard/subscription', icon: RiShieldFlashLine, color: 'violet' },
                                { label: 'Reviews', href: '/dashboard/reviews', icon: RiUserFollowLine, color: 'fuchsia' },
                            ].map((link, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => router.push(link.href)}
                                    className="flex flex-col items-center justify-center p-6 bg-white border border-slate-100 rounded-3xl hover:border-primary/20 hover:shadow-premium transition-all group"
                                >
                                    <div className={`w-12 h-12 rounded-2xl bg-${link.color}/10 text-emerald-500 flex items-center justify-center mb-3 group-hover:bg-emerald-500 group-hover:text-white transition-all`}>
                                        <link.icon size={24} />
                                    </div>
                                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest group-hover:text-emerald-500 transition-colors">{link.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    
                </div>

                <div className="space-y-8">
                    <div className="card-premium p-10 bg-slate-900 text-white relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-emerald-500/10 transition-colors pointer-events-none">
                          <RiCustomerService2Line size={120} />
                       </div>
                       <div className="relative z-10 space-y-6">
                          <div>
                            <h3 className="text-2xl font-black tracking-tight mb-2">Need Help?</h3>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed">Our specialized support team is ready to assist you.</p>
                          </div>
                          <button onClick={() => router.push('/dashboard/tickets')} className="w-full py-5 bg-emerald-500 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl hover:bg-emerald-500-dark transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                              Open Ticket
                          </button>
                       </div>
                    </div>

                    <div className="card-premium p-10 flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
                            <RiCheckDoubleLine size={24} />
                        </div>
                        <h3 className="font-bold text-slate-800">System Integrity</h3>
                        <p className="text-[10px] text-emerald-500 font-black mt-1 uppercase tracking-widest">Optimized</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardHome



