'use client'
import React, { useContext } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Context } from '@/component/helper/Context'
import { 
    RiDashboardLine, 
    RiUserLine, 
    RiInboxLine, 
    RiSettingsLine, 
    RiStackLine, 
    RiShieldUserLine,
    RiPriceTag3Line,
    RiLogoutBoxRLine,
    RiMailSendLine
} from 'react-icons/ri'

const SidebarItem = ({ item, collapsed }) => {
    const pathname = usePathname()
    const isActive = pathname === item.href

    return (
        <Link 
            href={item.href}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group
                ${isActive ? 'bg-emerald-500 text-white shadow-lg shadow-primary/30' : 'text-slate-500 hover:bg-emerald-500/5 hover:text-emerald-600'}`}
        >
            <item.icon className={`text-xl shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-600'}`} />
            {!collapsed && <span className="font-medium whitespace-nowrap">{item.label}</span>}
        </Link>
    )
}

const UserSidebar = ({ collapsed }) => {
    const { userData, handleLogout } = useContext(Context)
    const role = userData?.role || 'user'
    const isStaff = ['admin', 'manager', 'support', 'developer'].includes(role)

    const userMenu = [
        { label: 'User Portal', href: '/user', icon: RiUserLine },
        { label: 'Purchases', href: `/user/purchases`, icon: RiStackLine },
        { label: 'Subscriptions', href: `/user/subscription`, icon: RiShieldUserLine },
        { label: 'Tickets', href: `/user/tickets`, icon: RiInboxLine },
        { label: 'Reviews', href: `/user/reviews`, icon: RiPriceTag3Line },
    ]

    return (
        <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-white border-r border-slate-100 h-screen sticky top-0 transition-all duration-300 flex flex-col p-4 gap-8 z-30 shadow-sm font-sans`}>
            <div className={`flex items-center ${collapsed ? 'justify-center' : 'px-2'} gap-3 mt-2`}>
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20">
                    D
                </div>
                {!collapsed && <Link href={'/'} className="text-2xl font-black text-slate-800 tracking-tight">Disibin</Link>}
            </div>

            <nav className="flex flex-col gap-1.5 flex-1 overflow-y-auto no-scrollbar">
                <div className={`text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ${collapsed ? 'text-center' : 'px-2'} hidden md:block`}>
                    User Space
                </div>
                
                {isStaff && (
                    <SidebarItem 
                        item={{ label: 'Manager Console', href: '/dashboard', icon: RiDashboardLine }} 
                        collapsed={collapsed} 
                    />
                )}

                {userMenu.map((item, index) => (
                    <SidebarItem key={index} item={item} collapsed={collapsed} />
                ))}
            </nav>

            <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4">
                <SidebarItem 
                    item={{ label: 'Settings', href: '/user/settings', icon: RiSettingsLine }} 
                    collapsed={collapsed} 
                />
                <button 
                  onClick={() => handleLogout()}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-emerald-600 hover:bg-emerald-500 transition-all duration-300 group
                    ${collapsed ? 'justify-center' : ''}`}>
                    <RiLogoutBoxRLine className="text-xl text-emerald-600 group-hover:text-emerald-600 transition-colors" />
                    {!collapsed && <span className="font-bold">Logout</span>}
                </button>
            </div>
        </aside>
    )
}

export default UserSidebar
