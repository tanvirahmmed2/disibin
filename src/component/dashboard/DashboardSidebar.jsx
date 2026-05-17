'use client'
import Link from 'next/link'
import React, { useContext } from 'react'
import { Context } from '../helper/Context'
import { usePathname } from 'next/navigation'
import { 
  FiMessageSquare, 
  FiActivity, 
  FiPieChart, 
  FiBriefcase, 
  FiCreditCard, 
  FiUsers, 
  FiShoppingBag, 
  FiTag, 
  FiBox, 
  FiFolder, 
  FiCheckSquare, 
  FiLifeBuoy,
  FiUser,
  FiStar,
  FiShield,
  FiInbox
} from 'react-icons/fi'
import { FaGlobeAsia } from 'react-icons/fa'

const DashboardSidebar = () => {
  const { dashboardSidebar, setDashboardSidebar, userData, logout } = useContext(Context)
  const pathname = usePathname()

  const role = userData?.role || ''

  const links = {
    admin: [
      { name: 'Analytics', href: '/dashboard/admin/analytics', icon: <FiPieChart /> },
      { name: 'Activity Logs', href: '/dashboard/admin/activity', icon: <FiActivity /> },
      { name: 'People', href: '/dashboard/admin/people', icon: <FiUser /> },
      { name: 'Team', href: '/dashboard/admin/team', icon: <FiShield /> },
      { name: 'Careers', href: '/dashboard/admin/career', icon: <FiBriefcase /> },
      { name: 'Payments', href: '/dashboard/admin/payments', icon: <FiCreditCard /> },
      { name: 'Purchases', href: '/dashboard/admin/purchases', icon: <FiShoppingBag /> },
    ],
    manager: [
      { name: 'Analytics', href: '/dashboard/manager/analytics', icon: <FiPieChart /> },
      { name: 'Products', href: '/dashboard/manager/products', icon: <FiBox /> },
      { name: 'Projects', href: '/dashboard/manager/projects', icon: <FiFolder /> },
      { name: 'Coupons', href: '/dashboard/manager/coupon', icon: <FiTag /> },
      { name: 'Reviews', href: '/dashboard/manager/reviews', icon: <FiStar /> },
      { name: 'Tickets', href: '/dashboard/manager/tickets', icon: <FiLifeBuoy /> },
      { name: 'Tasks', href: '/dashboard/manager/tasks', icon: <FiCheckSquare /> },
      { name: 'Payments', href: '/dashboard/manager/payments', icon: <FiCreditCard /> },
      { name: 'Purchases', href: '/dashboard/manager/purchases', icon: <FiShoppingBag /> },
      { name: 'Activity', href: '/dashboard/manager/activity', icon: <FiActivity /> },
    ],
    support: [
      { name: 'Support Inbox', href: '/dashboard/support/support', icon: <FiInbox /> },
      { name: 'Tickets', href: '/dashboard/support/tickets', icon: <FiLifeBuoy /> },
      { name: 'Tasks', href: '/dashboard/support/tasks', icon: <FiCheckSquare /> },
    ],
    developer: [
      { name: 'Tasks', href: '/dashboard/developer/tasks', icon: <FiCheckSquare /> },
    ]
  }

  const roleLinks = links[role] || []

  const isActive = (href) => pathname === href

  return (
    <>
      {dashboardSidebar && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40  lg:hidden"
          onClick={() => setDashboardSidebar(false)}
        />
      )}

      <div
        className={`fixed top-14 left-0 z-50 h-[calc(100vh-3.5rem)] w-64 bg-white border-r border-slate-100 flex flex-col justify-between py-6 transition-transform duration-300 ease-in-out ${
          dashboardSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='flex flex-col gap-1 px-3 overflow-y-auto custom-scrollbar'>
          
          <Link
            href="/dashboard"
            onClick={() => setDashboardSidebar(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              isActive('/dashboard') 
                ? 'bg-sky-50 text-sky-600' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <FiActivity className="text-lg" />
            <span>Overview</span>
          </Link>

          {roleLinks.length > 0 && (
            <div className="mt-4">
              <p className="px-4 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                {role} Panel
              </p>
              <div className="flex flex-col gap-1">
                {roleLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setDashboardSidebar(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      isActive(link.href)
                        ? 'bg-sky-50 text-sky-600'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span>{link.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4">
            <p className="px-4 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Communication
            </p>
            <Link
              href="/dashboard/chat"
              onClick={() => setDashboardSidebar(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isActive('/dashboard/chat')
                  ? 'bg-sky-50 text-sky-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <FiMessageSquare className="text-lg" />
              <span>Internal Chat</span>
            </Link>
            <Link
              href="/"
              onClick={() => setDashboardSidebar(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isActive('/')
                  ? 'bg-sky-50 text-sky-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <FaGlobeAsia className="text-lg" />
              <span>Web Home</span>
            </Link>
          </div>
        </div>

        <div className='px-4 mt-auto space-y-2'>
           <div className='p-4 rounded-2xl bg-slate-50 border border-slate-100'>
              <p className='text-xs font-bold text-slate-900 truncate'>{userData?.name}</p>
              <p className='text-[10px] text-slate-500 uppercase tracking-wider mt-0.5'>{userData?.role}</p>
           </div>
           <button 
             onClick={logout}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 transition-all duration-200"
           >
             <FiActivity className="text-lg rotate-180" />
             <span>Log out</span>
           </button>
        </div>
      </div>
    </>
  )
}

export default DashboardSidebar
