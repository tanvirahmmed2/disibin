'use client'
import Link from 'next/link'
import React, { useContext } from 'react'
import { Context } from '../../helper/Context'
import { CiMenuBurger, CiMenuFries } from 'react-icons/ci'

const Navbar = () => {
    const {userSidebar, setUserSidebar, logout}=useContext(Context)
  return (
    <div className='w-full h-14 fixed top-0 px-4 sm:px-6 bg-white flex items-center justify-between z-50'>
        <div className='w-auto flex flex-row items-center justify-center gap-3'>
            <button onClick={()=>setUserSidebar(!userSidebar)} className='cursor-pointer'>
                {
                    userSidebar? <CiMenuFries size={20} /> : <CiMenuBurger size={20} />
                }
                </button>
        <Link href={'/user'} className='text-xl font-bold text-slate-800 tracking-tight'>Panel</Link>
        </div>
        <button className='px-5 py-1.5 rounded-xl cursor-pointer bg-primary hover:bg-primary-dark text-white font-bold text-xs transition-all shadow-md shadow-primary/20' onClick={()=>logout()}>Logout</button>
        
      
    </div>
  )
}

export default Navbar
