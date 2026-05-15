'use client'
import Link from 'next/link'
import React, { useContext } from 'react'
import { Context } from '../helper/Context'

const Sidebar = () => {
  const {
    sidebar,
    setSidebar,
    isLoggedIn,
    handleLogout,
    userData,
  } = useContext(Context)

  const closeSidebar = () => {
    setSidebar(false)
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Products', href: '/products' },
    { name: 'Projects', href: '/projects' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 sm:hidden ${
          sidebar
            ? 'opacity-100 visible'
            : 'opacity-0 invisible'
        }`}
      />

      <div
        onClick={closeSidebar}
        className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-all duration-300 sm:hidden ${
          sidebar
            ? 'opacity-100 visible'
            : 'opacity-0 invisible'
        }`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 flex flex-col gap-4 transform transition-all duration-300 ${
            sidebar
              ? 'scale-100 translate-y-0'
              : 'scale-95 translate-y-10'
          }`}
        >
            
          <div className='flex flex-col gap-2'>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeSidebar}
                className='w-full px-4 py-3 rounded-xl text-slate-700 font-medium hover:bg-sky-50 hover:text-sky-600 transition-all duration-300 text-center'
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className='w-full h-px bg-slate-100 my-2'></div>

          {isLoggedIn ? (
            <div className='flex flex-col gap-2'>
              <Link
                href={userData?.role === 'user' ? '/user' : '/dashboard'}
                onClick={closeSidebar}
                className='w-full px-4 py-3 rounded-xl text-slate-700 font-medium hover:bg-sky-50 hover:text-sky-600 transition-all duration-300 text-center'
              >
                Dashboard
              </Link>

              <Link
                href='/profile'
                onClick={closeSidebar}
                className='w-full px-4 py-3 rounded-xl text-slate-700 font-medium hover:bg-sky-50 hover:text-sky-600 transition-all duration-300 text-center'
              >
                Profile
              </Link>

              <Link
                href='/wishlist'
                onClick={closeSidebar}
                className='w-full px-4 py-3 rounded-xl text-slate-700 font-medium hover:bg-sky-50 hover:text-sky-600 transition-all duration-300 text-center'
              >
                Wishlist
              </Link>

              <button
                onClick={() => {
                  closeSidebar()
                  handleLogout()
                }}
                className='w-full px-4 py-3 rounded-xl text-red-500 font-medium hover:bg-red-50 transition-all duration-300'
              >
                Logout
              </button>
            </div>
          ) : (
            <div className='flex flex-col gap-3'>
              <Link
                href='/login'
                onClick={closeSidebar}
                className='w-full py-3 rounded-xl bg-slate-100 text-slate-900 text-center font-semibold hover:bg-slate-200 transition-all duration-300'
              >
                Login
              </Link>

              <Link
                href='/register'
                onClick={closeSidebar}
                className='w-full py-3 rounded-xl bg-slate-900 text-white text-center font-semibold hover:bg-sky-600 transition-all duration-300'
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Sidebar