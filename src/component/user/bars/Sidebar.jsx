'use client'
import React, { useContext } from 'react'
import { Context } from '../../helper/Context'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  FiUser, 
  FiLifeBuoy, 
  FiStar, 
  FiSettings,
  FiLogOut,
  FiClipboard,
  FiCreditCard,
  FiBookOpen,
  FiBell,
  FiShield
} from 'react-icons/fi'
import { FaGlobeAsia } from 'react-icons/fa'

const Sidebar = () => {
  const { userSidebar, setUserSidebar, userData, logout } = useContext(Context)
  const pathname = usePathname()

  const sections = [
    {
      label: 'My Workspace',
      links: [
        { name: 'Profile',      href: '/user/profile',      icon: <FiUser /> },
        { name: 'Projects',     href: '/user/projects',     icon: <FiClipboard /> },
        { name: 'Purchases',    href: '/user/purchases',    icon: <FiCreditCard /> },
        { name: 'Agreements',   href: '/user/agreements',   icon: <FiBookOpen /> },
      ],
    },
    {
      label: 'Support & Comms',
      links: [
        { name: 'Support Tickets', href: '/user/tickets',    icon: <FiLifeBuoy /> },
        { name: 'My Review',      href: '/user/reviews',    icon: <FiStar /> },
        { name: 'Notifications', href: '/user/notifications', icon: <FiBell /> },
      ],
    },
    {
      label: 'Preferences',
      links: [
        { name: 'Settings',      href: '/user/settings',      icon: <FiSettings /> },
        { name: 'Security',      href: '/user/security',      icon: <FiShield /> },
        { name: 'Web Home',      href: '/',                  icon: <FaGlobeAsia /> },
      ],
    },
  ]

  const isActive = (href) => {
    if (href === '/user') return pathname === '/user'
    return pathname === href || pathname.startsWith(href + '/')
  }

  const closeMenu = () => setUserSidebar(false)

  return (
    <>
      {/* Mobile overlay */}
      {userSidebar && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeMenu}
        />
      )}

      <aside
        className={`fixed top-14 left-0 z-50 h-[calc(100vh-3.5rem)] w-64 bg-white border-r border-slate-100 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          userSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Scrollable Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {sections.map((section) => (
            <div key={section.label}>
              <p className="px-4 mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                {section.label}
              </p>
              <div className="flex flex-col gap-0.5">
                {section.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className={`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive(link.href)
                        ? 'bg-primary/10 text-primary font-bold shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="text-base flex-shrink-0">{link.icon}</span>
                    <span>{link.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="px-4 py-4 border-t border-slate-100 space-y-2">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-xs font-bold text-slate-900 truncate">{userData?.name || 'Customer Account'}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5 truncate">{userData?.email || 'User'}</p>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 transition-all duration-200"
          >
            <FiLogOut className="text-base flex-shrink-0" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar