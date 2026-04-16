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
    <nav className='w-full fixed top-0 left-0 h-20 bg-white/80 backdrop-blur-xl border-b border-slate-50 z-50 flex items-center'>
      <div className='container-custom flex flex-row items-center justify-between'>
        <Link href={'/'} className='text-3xl font-black text-slate-900 tracking-tighter hover:text-emerald-600 transition-colors'>
          Disibin<span className='text-emerald-500'>.</span>
        </Link>

        <div className='hidden lg:flex items-center gap-2'>
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                isActive(link.href) 
                ? 'text-emerald-600 bg-emerald-50/50' 
                : 'text-slate-400 hover:text-slate-900'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          <div className='ml-4 h-4 w-px bg-slate-100'></div>

          {isLoggedin ? (
            <div className='relative ml-4 group'>
              <button className='flex items-center gap-3 p-1 rounded-full group-hover:bg-slate-50 transition-colors'>
                <div className='w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-sm transition-transform active:scale-95'>
                  {userData?.name?.charAt(0) || <CgProfile />}
                </div>
              </button>
              
              <div className='absolute right-0 top-full mt-4 w-60 bg-white border border-slate-100 rounded-[2rem] shadow-premium p-3 invisible group-hover:visible opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300'>
                <div className='px-4 py-3 mb-2'>
                    <p className='text-[10px] font-black uppercase tracking-widest text-slate-400'>Authorized User</p>
                    <p className='text-sm font-black text-slate-900 truncate'>{userData?.name}</p>
                </div>
                <div className='space-y-1'>
                    <Link href='/dashboard' className='flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 hover:text-emerald-600 rounded-xl transition-all'>
                    <RiDashboardLine className='text-lg' /> Dashboard
                    </Link>
                    <Link href='/profile' className='flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 hover:text-emerald-600 rounded-xl transition-all'>
                    <RiUserLine className='text-lg' /> Profile
                    </Link>
                    <Link href='/wishlist' className='flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 hover:text-emerald-600 rounded-xl transition-all'>
                    <RiHeartLine className='text-lg' /> Wishlist
                    </Link>
                </div>
                <div className='my-2 border-t border-slate-50'></div>
                <button 
                  onClick={() => window.location.replace('/api/user/logout')}
                  className='w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 rounded-xl transition-colors'
                >
                  <RiLogoutBoxRLine className='text-lg' /> Terminate Session
                </button>
              </div>
            </div>
          ) : (
            <Link 
              href={'/login'} 
              className='ml-6 btn-primary'
            >
              Sign In
            </Link>
          )}
        </div>

        <button 
          onClick={() => setSidebar(!sidebar)} 
          className='lg:hidden p-3 rounded-2xl text-slate-900 bg-slate-50 hover:bg-slate-100 transition-colors'
        >
          {sidebar ? <MdClose size={24} /> : <MdOutlineMenu size={24} />}
        </button>
      </div>
    </nav>
  )
}

export default Navbar

