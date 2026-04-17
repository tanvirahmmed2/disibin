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
    RiHistoryLine
} from 'react-icons/ri'

const SidebarItem = ({ item, collapsed }) => {
    const pathname = usePathname()
    const isActive = pathname === item.href

    return (
        <Link 
            href={item.href}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group
                ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-500 hover:bg-primary/5 hover:text-primary'}`}
        >
            <item.icon className={`text-xl flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary'}`} />
            {!collapsed && <span className="font-medium whitespace-nowrap">{item.label}</span>}
        </Link>
    )
}

const Sidebar = ({ collapsed }) => {
    const { userData, handleLogout } = useContext(Context)
    const role = userData?.role || 'client'

    const commonMenu = [
        { label: 'Overview', href: '/dashboard', icon: RiDashboardLine },
        { label: 'Purchases', href: '/dashboard/purchases', icon: RiStackLine },
        { label: 'Subscriptions', href: '/dashboard/subscription', icon: RiShieldUserLine },
        { label: 'Tickets', href: '/dashboard/tickets', icon: RiInboxLine },
        { label: 'Reviews', href: '/dashboard/reviews', icon: RiPriceTag3Line },
    ]

    
    if (role !== 'client') {
        commonMenu.push({ label: 'Internal Chat', href: '/dashboard/message', icon: RiMailSendLine })
    }

    const roleMenus = {
        admin: [
            { label: 'Biz Overview', href: '/dashboard/admin/overview', icon: RiDashboardLine },
            { label: 'Manage Users', href: '/dashboard/admin/users', icon: RiTeamLine },
            { label: 'Roles Ops', href: '/dashboard/admin/roles', icon: RiShieldUserLine },
            { label: 'All Purchases', href: '/dashboard/admin/purchases', icon: RiPriceTag3Line },
            { label: 'All Tickets', href: '/dashboard/admin/tickets', icon: RiInboxLine },
            { label: 'Activity Log', href: '/dashboard/admin/activity_log', icon: RiHistoryLine },
        ],
        manager: [
            { label: 'Assign Tasks', href: '/dashboard/manager/tasks', icon: RiStackLine },
            { label: 'User Control', href: '/dashboard/manager/users', icon: RiTeamLine },
            { label: 'Reviews Ops', href: '/dashboard/manager/reviews', icon: RiPriceTag3Line },
            { label: 'Purchases Ops', href: '/dashboard/manager/purchases', icon: RiStackLine },
            { label: 'Activity Log', href: '/dashboard/manager/activity_log', icon: RiHistoryLine },
        ],
        support: [
            { label: 'Messages', href: '/dashboard/support/messages', icon: RiMailSendLine },
            { label: 'Tickets Queue', href: '/dashboard/support/tickets', icon: RiCustomerService2Line },
        ],
        project_manager: [
            { label: 'PM Tickets', href: '/dashboard/project-manager/tickets', icon: RiInboxLine },
            { label: 'PM Tasks', href: '/dashboard/project-manager/tasks', icon: RiStackLine },
            { label: 'Projects', href: '/dashboard/project-manager/projects', icon: RiProjectorLine },
            { label: 'Activity Log', href: '/dashboard/project-manager/activity_log', icon: RiHistoryLine },
        ],
        editor: [
            { label: 'Blogs', href: '/dashboard/editor/blogs', icon: RiArticleLine },
            { label: 'Packages', href: '/dashboard/editor/packages', icon: RiStackLine },
            { label: 'Offers', href: '/dashboard/editor/offers', icon: RiPriceTag3Line },
            { label: 'Projects', href: '/dashboard/editor/projects', icon: RiProjectorLine },
            { label: 'Memberships', href: '/dashboard/editor/memberships', icon: RiShieldUserLine },
        ],
        staff: [
            { label: 'My Tasks', href: '/dashboard/staff/tasks', icon: RiStackLine },
        ]
    }

    const currentRoleMenu = roleMenus[role] || []

    return (
        <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-white border-r border-slate-100 h-screen sticky top-0 transition-all duration-300 flex flex-col p-4 gap-8 z-30 shadow-sm font-sans`}>
            <div className={`flex items-center ${collapsed ? 'justify-center' : 'px-2'} gap-3 mt-2`}>
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20">
                    D
                </div>
                {!collapsed && <Link href={'/'} className="text-2xl font-black text-slate-800 tracking-tight">Disibin</Link>}
            </div>

            <nav className="flex flex-col gap-1.5 flex-1 overflow-y-auto no-scrollbar">
                <div className={`text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ${collapsed ? 'text-center' : 'px-2'} hidden md:block`}>
                    User Space
                </div>
                {commonMenu.map((item, index) => (
                    <SidebarItem key={index} item={item} collapsed={collapsed} />
                ))}

                {role !== 'client' && currentRoleMenu.length > 0 && (
                    <>
                        <div className={`text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-8 mb-2 ${collapsed ? 'text-center' : 'px-2'} hidden md:block`}>
                            {role.replace('_', ' ')} Console
                        </div>
                        {currentRoleMenu.map((item, index) => (
                            <SidebarItem key={`role-${index}`} item={item} collapsed={collapsed} />
                        ))}
                    </>
                )}
            </nav>

            <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4">
                <SidebarItem 
                    item={{ label: 'Settings', href: '/dashboard/settings', icon: RiSettingsLine }} 
                    collapsed={collapsed} 
                />
                <button 
                  onClick={() => handleLogout()}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-primary hover:bg-primary transition-all duration-300 group
                    ${collapsed ? 'justify-center' : ''}`}>
                    <RiLogoutBoxRLine className="text-xl text-primary group-hover:text-primary transition-colors" />
                    {!collapsed && <span className="font-bold">Logout</span>}
                </button>
            </div>
        </aside>
    )
}

export default Sidebar


