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
    RiLogoutBoxRLine
} from 'react-icons/ri'

const SidebarItem = ({ item, collapsed }) => {
    const pathname = usePathname()
    const isActive = pathname === item.href

    return (
        <Link 
            href={item.href}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group
                ${isActive ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'}`}
        >
            <item.icon className={`text-xl flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-500'}`} />
            {!collapsed && <span className="font-medium whitespace-nowrap">{item.label}</span>}
        </Link>
    )
}

const Sidebar = ({ collapsed }) => {
    const { userData } = useContext(Context)
    const role = userData?.role || 'client'

    const menuConfigs = {
        admin: [
            { label: 'Overview', href: '/dashboard', icon: RiDashboardLine },
            { label: 'Users', href: '/dashboard/admin/users', icon: RiTeamLine },
            { label: 'Payments', href: '/dashboard/admin/payments', icon: RiPriceTag3Line },
            { label: 'Support Tickets', href: '/dashboard/support', icon: RiInboxLine },
            { label: 'Internal Mail', href: '/dashboard/mail', icon: RiMailSendLine },
        ],
        manager: [
            { label: 'Business', href: '/dashboard', icon: RiDashboardLine },
            { label: 'User Management', href: '/dashboard/admin/users', icon: RiTeamLine },
            { label: 'All Tasks', href: '/dashboard/manager/tasks', icon: RiStackLine },
            { label: 'All Tickets', href: '/dashboard/support', icon: RiInboxLine },
            { label: 'Internal Mail', href: '/dashboard/mail', icon: RiMailSendLine },
        ],
        editor: [
            { label: 'Content Hub', href: '/dashboard', icon: RiDashboardLine },
            { label: 'Blogs', href: '/dashboard/editor/blogs', icon: RiArticleLine },
            { label: 'Packages', href: '/dashboard/editor/packages', icon: RiStackLine },
            { label: 'Projects', href: '/dashboard/editor/projects', icon: RiProjectorLine },
            { label: 'Memberships', href: '/dashboard/editor/memberships', icon: RiShieldUserLine },
        ],
        support: [
            { label: 'Ticket Queue', href: '/dashboard', icon: RiInboxLine },
            { label: 'My Chats', href: '/dashboard/support', icon: RiCustomerService2Line },
            { label: 'Mail', href: '/dashboard/mail', icon: RiMailSendLine },
        ],
        project_manager: [
            { label: 'Overview', href: '/dashboard', icon: RiDashboardLine },
            { label: 'Project Tickets', href: '/dashboard/pm/tickets', icon: RiInboxLine },
            { label: 'Project Tasks', href: '/dashboard/pm/tasks', icon: RiStackLine },
            { label: 'Mail', href: '/dashboard/mail', icon: RiMailSendLine },
        ],
        staff: [
            { label: 'My Tasks', href: '/dashboard', icon: RiStackLine },
            { label: 'Internal Mail', href: '/dashboard/mail', icon: RiMailSendLine },
        ],
        client: [
            { label: 'Home', href: '/dashboard', icon: RiDashboardLine },
            { label: 'My Tickets', href: '/dashboard/tickets', icon: RiInboxLine },
            { label: 'Purchases', href: '/dashboard/purchases', icon: RiStackLine },
            { label: 'Subscription', href: '/dashboard/subscription', icon: RiShieldUserLine },
            { label: 'Reviews', href: '/dashboard/reviews', icon: RiPriceTag3Line },
            { label: 'Profile', href: '/profile', icon: RiUserLine },
        ]
    }

    const currentMenu = menuConfigs[role] || menuConfigs['client']

    return (
        <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-white border-r border-slate-100 h-screen sticky top-0 transition-all duration-300 flex flex-col p-4 gap-8 z-30 shadow-sm font-sans`}>
            <div className={`flex items-center ${collapsed ? 'justify-center' : 'px-2'} gap-3 mt-2`}>
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-500/20">
                    D
                </div>
                {!collapsed && <span className="text-2xl font-black text-slate-800 tracking-tight">Disibin</span>}
            </div>

            <nav className="flex flex-col gap-1.5 flex-1 overflow-y-auto no-scrollbar">
                <div className={`text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ${collapsed ? 'text-center' : 'px-2'} hidden md:block`}>
                    Main Menu
                </div>
                {currentMenu.map((item, index) => (
                    <SidebarItem key={index} item={item} collapsed={collapsed} />
                ))}
            </nav>

            <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4">
                <SidebarItem 
                    item={{ label: 'Settings', href: '/dashboard/settings', icon: RiSettingsLine }} 
                    collapsed={collapsed} 
                />
                <button 
                  onClick={() => window.location.replace('/api/user/logout')}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-rose-500 hover:bg-rose-50 transition-all duration-300 group
                    ${collapsed ? 'justify-center' : ''}`}>
                    <RiLogoutBoxRLine className="text-xl text-rose-400 group-hover:text-rose-500 transition-colors" />
                    {!collapsed && <span className="font-bold">Logout</span>}
                </button>
            </div>
        </aside>
    )
}

export default Sidebar


