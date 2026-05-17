'use client'
import Link from 'next/link'
import React, { useContext, useEffect, useState, useRef } from 'react'
import { Context } from '../helper/Context'
import { CiMenuBurger, CiMenuFries } from 'react-icons/ci'
import { FiUser, FiLogOut, FiGrid, FiShield } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
  const { sidebar, setSidebar, isLoggedIn, userData, logout } = useContext(Context)

  const [showTopbar, setShowTopbar] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrolled(currentScrollY > 20)
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowTopbar(false)
        setDropdownOpen(false) // Close dropdown on scroll
      } else {
        setShowTopbar(true)
      }
      setLastScrollY(currentScrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const links = [
    { label: 'Products', href: '/products' },
    { label: 'Projects', href: '/projects' },
    { label: 'About',    href: '/about' },
  ]

  const isManagement = userData?.role && userData.role !== 'user'

  return (
    <div className='w-full fixed top-0 px-3 sm:px-4 z-50 pt-3'>
      <nav
        className={`w-full bg-sky-100 flex items-center justify-between h-14 px-5 rounded-2xl transition-all duration-500 ${
          showTopbar ? 'translate-y-0 opacity-100' : '-translate-y-[120%] opacity-0'  } `}
      >
        <Link
          href='/'
          className='text-2xl font-poppins font-semibold tracking-tight text-slate-900 hover:text-sky-500 transition-colors duration-300'
        >
          Disibin
        </Link>

        <div className='hidden sm:flex flex-row items-center gap-1'>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className='px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition-all duration-200'
            >
              {l.label}
            </Link>
          ))}

          <div className='ml-3 h-5 w-px bg-slate-200' />

          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className='ml-3 px-5 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-sky-600 transition-all duration-300 shadow-sm flex items-center gap-2'
              >
                Account
                <span className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}>▾</span>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 space-y-1 z-50"
                  >
                    <div className="px-3 py-2 border-b border-slate-50 mb-1">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Welcome</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{userData?.name || 'User'}</p>
                    </div>

                    <Link
                      href="/user/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-violet-600 transition-all"
                    >
                      <FiUser className="shrink-0" /> Profile
                    </Link>

                    <Link
                      href="/user"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-violet-600 transition-all"
                    >
                      <FiGrid className="shrink-0" /> User Portal
                    </Link>

                    {isManagement && (
                      <Link
                        href="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-violet-600 transition-all"
                      >
                        <FiShield className="shrink-0" /> Management
                      </Link>
                    )}

                    <div className="border-t border-slate-50 my-1" />

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-all"
                    >
                      <FiLogOut className="shrink-0" /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href='/login'
              className='ml-3 px-5 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-sky-600 transition-all duration-300 shadow-sm'
            >
              Login
            </Link>
          )}
        </div>

        <button
          onClick={() => setSidebar(!sidebar)}
          className='sm:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors'
          aria-label='Toggle menu'
        >
          {sidebar ? <CiMenuFries size={20} /> : <CiMenuBurger size={20} />}
        </button>
      </nav>
    </div>
  )
}

export default Navbar