'use client'
import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../helper/Context'
import { CiMenuBurger, CiMenuFries } from 'react-icons/ci'

const Navbar = () => {
  const { sidebar, setSidebar, isLoggedIn, userData } = useContext(Context)

  const [showTopbar, setShowTopbar] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrolled(currentScrollY > 20)
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowTopbar(false)
      } else {
        setShowTopbar(true)
      }
      setLastScrollY(currentScrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const links = [
    { label: 'Products', href: '/products' },
    { label: 'Projects', href: '/projects' },
    { label: 'About',    href: '/about' },
  ]

  return (
    <div className='w-full fixed top-0 px-3 sm:px-4 z-50 pt-3'>
      <nav
        className={`w-full bg-white flex items-center justify-between h-14 px-5 rounded-2xl transition-all duration-500 ${
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
            <Link
              href={userData?.role === 'user' ? '/user' : '/dashboard'}
              className='ml-3 px-5 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-sky-600 transition-all duration-300 shadow-sm'
            >
              Dashboard
            </Link>
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