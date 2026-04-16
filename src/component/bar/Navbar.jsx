'use client'
import Link from 'next/link'
import React, { useContext } from 'react'
import { Context } from '../helper/Context'
import { usePathname } from 'next/navigation'
import { MdOutlineMenu, MdClose } from "react-icons/md";
import { CgProfile } from 'react-icons/cg';
import { RiLogoutBoxRLine, RiDashboardLine, RiUserLine, RiHeartLine } from 'react-icons/ri';

const Navbar = () => {
  const { sidebar, setSidebar, isLoggedin, userData } = useContext(Context)
  const pathname = usePathname()

  const navLinks = [
    { name: 'Services', href: '/services' },
    { name: 'Plans', href: '/packages' },
    { name: 'Premium', href: '/memberships' },
    { name: 'Projects', href: '/projects' },
    { name: 'Blogs', href: '/blogs' },
    { name: 'About', href: '/about' },
  ]

  const isActive = (href) => pathname === href

  return (
    <nav className='w-full fixed top-0 left-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50 flex items-center shadow-sm'>
      <div className='container-custom flex flex-row items-center justify-between'>
        <Link href={'/'} className='text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity'>
          Disibin
        </Link>

        {/* Desktop Menu */}
        <div className='hidden lg:flex items-center gap-1'>
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive(link.href) 
                ? 'text-emerald-600 bg-emerald-50' 
                : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          <div className='ml-4 h-6 w-px bg-slate-200'></div>

          {isLoggedin ? (
            <div className='relative ml-4 group'>
              <button className='flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors border border-slate-100'>
                <div className='w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold'>
                  {userData?.name?.charAt(0) || <CgProfile />}
                </div>
              </button>
              
              <div className='absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300'>
                <Link href='/dashboard' className='flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors'>
                  <RiDashboardLine className='text-lg' /> Dashboard
                </Link>
                <Link href='/profile' className='flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors'>
                  <RiUserLine className='text-lg' /> Profile
                </Link>
                <Link href='/wishlist' className='flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors'>
                  <RiHeartLine className='text-lg' /> Wishlist
                </Link>
                <div className='my-1 border-t border-slate-50'></div>
                <button className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors'>
                  <RiLogoutBoxRLine className='text-lg' /> Logout
                </button>
              </div>
            </div>
          ) : (
            <Link 
              href={'/login'} 
              className='ml-4 px-6 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all'
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setSidebar(!sidebar)} 
          className='lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors'
        >
          {sidebar ? <MdClose size={28} /> : <MdOutlineMenu size={28} />}
        </button>
      </div>
    </nav>
  )
}

export default Navbar

