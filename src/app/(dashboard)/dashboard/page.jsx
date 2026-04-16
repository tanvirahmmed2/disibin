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
                console.error('Failed to fetch stats', error)
            } finally {
                setLoading(false)
            }
        }
        if (userData?._id) fetchStats()
    }, [userData])

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
              <div className="mt-4 text-slate-400 font-medium animate-pulse">Loading dashboard...</div>
            </div>
        </div>
    )

    const overview = stats?.overview || []

    const renderHeader = (title, subtitle) => (
        <div className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">{title}</h1>
            {subtitle && <p className="text-slate-500 mt-2 text-lg font-medium">{subtitle}</p>}
            <div className="mt-4 w-12 h-1.5 bg-emerald-500 rounded-full"></div>
        </div>
    )

    const renderStats = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
                    color={['emerald', 'blue', 'purple', 'amber', 'rose', 'indigo'][index % 6]}
                />
            ))}
        </div>
    )

    const ActivitySection = () => (
      <div className="card-premium p-8 mt-12 bg-white">
          <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-800">Recent Activity</h3>
              <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors uppercase tracking-widest px-4 py-2 hover:bg-emerald-50 rounded-xl">View All</button>
          </div>
          <div className="space-y-6">
              {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                          <RiTimeLine size={24} />
                      </div>
                      <div className="flex-1">
                          <h4 className="font-bold text-slate-800">System generated update</h4>
                          <p className="text-sm text-slate-500">Activity logged automatically by the system.</p>
                      </div>
                      <span className="text-xs font-bold text-slate-400 capitalize">Just now</span>
                  </div>
              ))}
          </div>
      </div>
    )

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {role === 'admin' ? renderHeader('Administrator Console', 'Scale and manage your digital empire.') :
             role === 'manager' ? renderHeader('Business Oversight', 'Optimize operations and track growth.') :
             role === 'staff' ? renderHeader('Staff Portal', 'Coordinate tasks and deliver excellence.') :
             renderHeader(`Welcome Back, ${userData?.name}!`, 'Here is what is happening with your projects.')}
            
            {renderStats()}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
              <div className="lg:col-span-2">
                <ActivitySection />
              </div>
              <div className="space-y-8">
                <div className="card-premium p-8 bg-gradient-to-br from-emerald-600 to-teal-700 text-white relative overflow-hidden">
                   <div className="relative z-10">
                     <h3 className="text-xl font-bold mb-2">Need Help?</h3>
                     <p className="text-emerald-50 text-sm mb-6">Our support team is available 24/7 to assist you with any issues.</p>
                     <button className="w-full py-3 bg-white text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition-colors">Contact Support</button>
                   </div>
                   <RiCustomerService2Line className="absolute -right-8 -bottom-8 text-white/10 w-48 h-48" />
                </div>

                <div className="card-premium p-8 bg-white border-dashed border-2 border-slate-200 shadow-none">
                   <div className="flex flex-col items-center text-center">
                     <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                       <RiCheckDoubleLine size={32} />
                     </div>
                     <h3 className="font-bold text-slate-800">System Status</h3>
                     <p className="text-sm text-emerald-500 font-bold mt-1">All Systems Operational</p>
                   </div>
                </div>
              </div>
            </div>
        </div>
    )
}

export default DashboardHome


