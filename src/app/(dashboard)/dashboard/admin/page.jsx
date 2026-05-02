'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import {
    RiUserFollowLine,
    RiPriceTag3Line,
    RiArticleLine,
    RiProjectorLine,
    RiTaskLine,
    RiTicketLine,
    RiBuildingLine,
    RiArrowRightSLine,
    RiShieldUserLine,
    RiSettings3Line,
    RiBarChartBoxLine,
    RiHistoryLine,
} from 'react-icons/ri'

const ICON_MAP = {
    users:    RiUserFollowLine,
    packages: RiPriceTag3Line,
    blogs:    RiArticleLine,
    projects: RiProjectorLine,
    tasks:    RiTaskLine,
    tickets:  RiTicketLine,
    tenants:  RiBuildingLine,
}

const ADMIN_SECTIONS = [
    {
        label: 'User Management',
        description: 'View, edit, and control platform user accounts and roles.',
        href: '/dashboard/admin/users',
        icon: RiUserFollowLine,
    },
    {
        label: 'Role Management',
        description: 'Assign and restrict staff-level permissions across the platform.',
        href: '/dashboard/admin/roles',
        icon: RiShieldUserLine,
    },
    {
        label: 'Purchase History',
        description: 'Audit all platform purchases and transaction records.',
        href: '/dashboard/admin/purchases',
        icon: RiBarChartBoxLine,
    },
    {
        label: 'Activity Logs',
        description: 'Full audit trail of admin and system-level actions.',
        href: '/dashboard/admin/activity_log',
        icon: RiHistoryLine,
    },
    {
        label: 'Tenant Registry',
        description: 'Manage all registered tenants and their subscription status.',
        href: '/dashboard/manager/tenants',
        icon: RiBuildingLine,
    },
    {
        label: 'Package Catalog',
        description: 'Create and manage service packages available to subscribers.',
        href: '/dashboard/manager/packages',
        icon: RiPriceTag3Line,
    },
]

const AdminOverview = () => {
    const router = useRouter()
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('/api/dashboard/stats')
                setStats(res.data.data)
            } catch {}
            finally { setLoading(false) }
        }
        fetchStats()
    }, [])

    const overview = stats?.overview || []

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="border-b border-slate-200 pb-4">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Admin · Global View</p>
                <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Business Overview</h1>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Global platform metrics and operational health.</p>
            </div>

            {/* Stats Grid */}
            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="bg-white border border-slate-200 p-4 h-20 animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {overview.map((stat, i) => {
                        const Icon = ICON_MAP[stat.type] || RiBarChartBoxLine
                        return (
                            <div key={i} className="bg-white border border-slate-200 p-4 group hover:border-slate-500 transition-all cursor-default">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 group-hover:border-slate-800 group-hover:bg-slate-900 group-hover:text-white transition-all shrink-0">
                                        <Icon size={14} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest truncate">{stat.title}</p>
                                        <p className="text-xl font-bold text-slate-900 leading-none mt-0.5">{stat.value ?? 0}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Admin Section Grid */}
            <div>
                <div className="border-b border-slate-200 pb-3 mb-4">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Management Modules</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {ADMIN_SECTIONS.map((section, i) => (
                        <button
                            key={i}
                            onClick={() => router.push(section.href)}
                            className="text-left bg-white border border-slate-200 p-5 hover:border-slate-800 transition-all group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-9 h-9 border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:border-slate-900 group-hover:text-white transition-all shrink-0">
                                    <section.icon size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-bold text-slate-900 uppercase tracking-tight group-hover:text-slate-700 transition-all">{section.label}</p>
                                        <RiArrowRightSLine size={14} className="text-slate-300 group-hover:text-slate-800 group-hover:translate-x-0.5 transition-all" />
                                    </div>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight leading-relaxed mt-1.5">
                                        {section.description}
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Full-Width Manager Console CTA */}
            <div className="bg-slate-900 border border-slate-800 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Full Console</p>
                    <h3 className="text-sm font-bold text-white uppercase tracking-tight">Manager Dashboard</h3>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1 leading-relaxed">
                        Access the full suite of manager tools — projects, tasks, tickets, subscriptions, and more.
                    </p>
                </div>
                <button
                    onClick={() => router.push('/dashboard/manager')}
                    className="shrink-0 flex items-center gap-2 px-5 py-3 bg-white text-slate-900 text-[9px] font-bold uppercase tracking-widest hover:bg-slate-100 transition-all"
                >
                    Open Manager Panel <RiArrowRightSLine size={14} />
                </button>
            </div>
        </div>
    )
}

export default AdminOverview
