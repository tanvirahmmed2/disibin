'use client'
import Link from 'next/link'
import React, { useContext } from 'react'
import { Context } from '../helper/Context'

const Sidebar = () => {
    const { sidebar, setSidebar, isLoggedIn, handleLogout, userData } = useContext(Context)
    const closeSidebar = () => {
        setSidebar(false)
    }

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Services', href: '/services' },
        { name: 'Plans', href: '/packages' },
        { name: 'Projects', href: '/projects' },
        { name: 'Blogs', href: '/blogs' },
        { name: 'About', href: '/about' },
    ]

    return (
        <>
            
            {sidebar && (
                <div 
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
                    onClick={closeSidebar}
                ></div>
            )}

            
            <div className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-100 z-40 flex flex-col p-6 transition-transform duration-300 ease-in-out lg:hidden ${sidebar ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.href}
                            href={link.href} 
                            className='px-4 py-3 rounded-xl text-slate-600 font-medium hover:bg-emerald-500/5 hover:text-emerald-500 transition-all duration-300 w-full' 
                            onClick={closeSidebar}
                        >
                            {link.name}
                        </Link>
                    ))}
                    
                    <div className="my-4 h-px w-full bg-slate-50"></div>

                    {isLoggedIn ? (
                        <div className='flex flex-col gap-2'>
                            <Link href={userData?.role === 'user' ? '/user' : '/dashboard'} className='px-4 py-3 rounded-xl text-slate-600 font-medium hover:bg-emerald-500/5 hover:text-emerald-500 transition-all duration-300 w-full' onClick={closeSidebar}>Dashboard</Link>
                            <Link href='/profile' className='px-4 py-3 rounded-xl text-slate-600 font-medium hover:bg-emerald-500/5 hover:text-emerald-500 transition-all duration-300 w-full' onClick={closeSidebar}>Profile</Link>
                            <Link href='/wishlist' className='px-4 py-3 rounded-xl text-slate-600 font-medium hover:bg-emerald-500/5 hover:text-emerald-500 transition-all duration-300 w-full' onClick={closeSidebar}>Wishlist</Link>
                            <button className='px-4 py-3 rounded-xl text-red-500 font-medium hover:bg-red-50 text-left transition-all duration-300 w-full' onClick={() => { closeSidebar(); handleLogout() }}>Logout</button>
                        </div>
                    ) : (
                        <div className='flex flex-col gap-3 mt-auto pt-4'>
                            <Link href='/login' className='w-full py-3 rounded-xl bg-slate-50 text-slate-900 text-center font-semibold hover:bg-slate-100 transition-colors' onClick={closeSidebar}>Login</Link>
                            <Link href='/register' className='w-full py-3 rounded-xl bg-slate-900 text-white text-center font-semibold hover:bg-emerald-600 transition-all' onClick={closeSidebar}>Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Sidebar
