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
    RiMailSendLine,
    RiMoneyDollarBoxLine,
    RiShieldStarLine,
    RiFoldersLine
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

const UserSidebar = ({ collapsed }) => {
    const { userData, handleLogout } = useContext(Context)
    const role = userData?.role || 'user'
    const isStaff = ['admin', 'manager', 'support', 'developer'].includes(role)

    const userMenu = [
        { label: 'My Projects', href: '/user/website', icon: RiFoldersLine },
        { label: 'My Subscriptions', href: '/user/subscription', icon: RiShieldStarLine },
        { label: 'Purchase History', href: '/user/purchases', icon: RiMoneyDollarBoxLine },
        { label: 'Support Tickets', href: `/user/tickets`, icon: RiInboxLine },
        { label: 'Service Reviews', href: `/user/reviews`, icon: RiPriceTag3Line },
    ]

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
                <div className={`text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ${collapsed ? 'lg:text-center' : 'px-2'}`}>
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

export default UserSidebar
