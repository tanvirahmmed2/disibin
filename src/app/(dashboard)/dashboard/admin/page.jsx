'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import StatCard from '@/component/dashboard/StatCard'
import { 
    RiUserFollowLine, 
    RiPriceTag3Line, 
    RiArticleLine, 
    RiProjectorLine, 
    RiTaskLine, 
    RiTicketLine 
} from 'react-icons/ri'

const AdminOverview = () => {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('/api/dashboard/stats')
                setStats(res.data.data)
            } catch (error) {
                console.error('Failed to fetch stats', error)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    if (loading) return (
        <div className="flex items-center justify-center min-h-[40vh]">
            <div className="w-10 h-10 border-4 border-slate-50 border-t-primary rounded-full animate-spin"></div>
        </div>
    )

    const overview = stats?.overview || []

    return (
        <div className="space-y-10">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Business Overview</h1>
                <p className="text-slate-500 font-medium">Global platform metrics and operational health.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                            RiTicketLine
                        }
                        color={['primary', 'indigo', 'violet', 'fuchsia', 'rose', 'amber'][index % 6]}
                    />
                ))}
            </div>

            <div className="card-premium p-10 bg-slate-50/50 border-none">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">User Management</h3>
                        <p className="text-slate-400 text-sm font-medium">Control platform access and specialized roles.</p>
                    </div>
                    <a href="/dashboard/admin/users" className="px-8 py-4 bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-black transition-all">
                        View Directory
                    </a>
                </div>
            </div>
        </div>
    )
}

export default AdminOverview
