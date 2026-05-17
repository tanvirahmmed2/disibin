'use client'
import React, { useContext } from 'react'
import { Context } from '../helper/Context'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  FiUser, 
  FiLifeBuoy, 
  FiShoppingBag, 
  FiCreditCard, 
  FiStar, 
  FiSettings,
  FiLogOut
} from 'react-icons/fi'

const UserSidebar = () => {
  const { userSidebar, setUserSidebar, userData, logout } = useContext(Context)
  const pathname = usePathname()

  const links = [
    { name: 'Profile', href: '/user/profile', icon: <FiUser /> },
    { name: 'Purchases', href: '/user/purchases', icon: <FiShoppingBag /> },
    { name: 'Payments', href: '/user/payments', icon: <FiCreditCard /> },
    { name: 'Tickets', href: '/user/tickets', icon: <FiLifeBuoy /> },
    { name: 'Reviews', href: '/user/reviews', icon: <FiStar /> },
    { name: 'Settings', href: '/user/settings', icon: <FiSettings /> },
  ]

  const isActive = (href) => pathname === href

  return (
    <>
      {userSidebar && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setUserSidebar(false)}
        />
      )}

      <div
        className={`fixed top-14 left-0 z-50 h-[calc(100vh-3.5rem)] w-64 bg-white border-r border-slate-100 flex flex-col justify-between py-6 transition-transform duration-300 ease-in-out ${
          userSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='flex flex-col gap-1 px-3 overflow-y-auto custom-scrollbar'>
          <p className="px-4 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            User Menu
          </p>
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setUserSidebar(false)}
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

        <div className='px-4 mt-auto space-y-2'>
           <div className='p-4 rounded-2xl bg-slate-50 border border-slate-100'>
              <p className='text-xs font-bold text-slate-900 truncate'>{userData?.name}</p>
              <p className='text-[10px] text-slate-500 uppercase tracking-wider mt-0.5'>Customer</p>
           </div>
           <button 
             onClick={logout}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 transition-all duration-200"
           >
             <FiLogOut className="text-lg" />
             <span>Log Out</span>
           </button>
        </div>
      </div>
    </>
  )
}

export default UserSidebar