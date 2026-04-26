'use client'
import React, { useContext } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Context } from '@/component/helper/Context'
import { 
    RiDashboardLine, 
    RiUserLine, 
    RiArticleLine, 
    RiInboxLine, 
    RiSettingsLine, 
    RiTeamLine, 
    RiProjectorLine, 
    RiStackLine, 
    RiShieldUserLine,
    RiCustomerService2Line,
    RiMailSendLine,
    RiPriceTag3Line,
    RiLogoutBoxRLine,
    RiHistoryLine,
    RiMoneyDollarBoxLine
} from 'react-icons/ri'

const SidebarItem = ({ item, collapsed }) => {
    const pathname = usePathname()
    const isActive = pathname === item.href

    return (
        <Link 
            href={item.href}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group
                ${isActive ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500 hover:bg-emerald-500/5 hover:text-emerald-600'}`}
        >
            <item.icon className={`text-xl shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-600'}`} />
            {(!collapsed || typeof window !== 'undefined' && window.innerWidth < 1024) && <span className="font-medium whitespace-nowrap">{item.label}</span>}
        </Link>
    )
}

const Sidebar = ({ collapsed }) => {
    const { userData, handleLogout } = useContext(Context)
    const role = userData?.role || 'user'

    const roleMenus = {
        admin: [
            { label: 'Overview', href: '/dashboard/admin', icon: RiDashboardLine },
            { label: 'Manage Users', href: '/dashboard/admin/users', icon: RiTeamLine },
            { label: 'Roles', href: '/dashboard/admin/roles', icon: RiShieldUserLine },
            { label: 'All Purchases', href: '/dashboard/admin/purchases', icon: RiPriceTag3Line },
            { label: 'Activity Log', href: '/dashboard/admin/activity_log', icon: RiHistoryLine },
        ],
        manager: [
            { label: 'Assign Tasks', href: '/dashboard/manager/tasks', icon: RiStackLine },
            { label: 'My Tickets', href: '/dashboard/manager/tickets', icon: RiCustomerService2Line },
            { label: 'Manage Blogs', href: '/dashboard/manager/blogs', icon: RiArticleLine },
            { label: 'Manage Packages', href: '/dashboard/manager/packages', icon: RiPriceTag3Line },
            { label: 'Project', href: '/dashboard/manager/projects', icon: RiProjectorLine },
            { label: 'Category', href: '/dashboard/manager/categories', icon: RiPriceTag3Line },
            { label: 'Coupon', href: '/dashboard/manager/coupons', icon: RiInboxLine },
            { label: 'User Control', href: '/dashboard/manager/users', icon: RiTeamLine },
            { label: 'Reviews', href: '/dashboard/manager/reviews', icon: RiPriceTag3Line },
            { label: 'Purchases', href: '/dashboard/manager/purchases', icon: RiMoneyDollarBoxLine },
            { label: 'Activity Log', href: '/dashboard/manager/activity_log', icon: RiHistoryLine },
        ],
        support: [
            { label: 'Messages', href: '/dashboard/support/messages', icon: RiMailSendLine },
            { label: 'Tickets Queue', href: '/dashboard/support/tickets', icon: RiCustomerService2Line },
        ],
        developer: [
            { label: 'My Tasks', href: '/dashboard/developer/tasks', icon: RiStackLine },
        ]
    }

    const currentRoleMenu = roleMenus[role] || []

    return (
        <aside className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-100 transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen lg:sticky lg:top-0
            ${collapsed ? '-translate-x-full lg:w-20 lg:translate-x-0' : 'translate-x-0'}
            flex flex-col p-4 gap-8 shadow-sm font-sans
        `}>
            <div className={`flex items-center ${collapsed ? 'lg:justify-center' : 'px-2'} gap-3 mt-2`}>
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-slate-900/10">
                    D
                </div>
                {(!collapsed || typeof window !== 'undefined' && window.innerWidth < 1024) && (
                    <Link href={'/'} className="text-2xl font-bold text-slate-900 tracking-tight">Disibin</Link>
                )}
            </div>

            <nav className="flex flex-col gap-1.5 flex-1 overflow-y-auto no-scrollbar">
                <SidebarItem 
                    item={{ label: 'User Portal', href: '/user', icon: RiUserLine }} 
                    collapsed={collapsed} 
                />
                
                {role !== 'user' && (
                    <SidebarItem 
                        item={{ label: 'Internal Chat', href: '/dashboard/mail', icon: RiMailSendLine }} 
                        collapsed={collapsed} 
                    />
                )}

                {role !== 'user' && currentRoleMenu.length > 0 && (
                    <>
                        <div className={`text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-8 mb-2 ${collapsed ? 'lg:text-center' : 'px-2'}`}>
                            {role.replace('_', ' ')} Console
                        </div>
                        {currentRoleMenu.map((item, index) => (
                            <SidebarItem key={`role-${index}`} item={item} collapsed={collapsed} />
                        ))}
                    </>
                )}
            </nav>

            <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4">
                <button 
                  onClick={() => handleLogout()}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-emerald-600 hover:bg-emerald-50 transition-all duration-300 group
                    ${collapsed ? 'lg:justify-center' : ''}`}>
                    <RiLogoutBoxRLine className="text-xl text-emerald-600 transition-colors" />
                    {(!collapsed || typeof window !== 'undefined' && window.innerWidth < 1024) && (
                        <span className="font-bold">Logout</span>
                    )}
                </button>
            </div>
        </aside>
    )
}

export default Sidebar


