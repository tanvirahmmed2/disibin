'use client'
import Link from 'next/link'
import React, { useContext } from 'react'
import { Context } from '../helper/Context'
import { CiMenuBurger, CiMenuFries } from 'react-icons/ci'

const UserNavbar = () => {
    const {userSidebar, setUserSidebar, logout}=useContext(Context)
  return (
    <div className='w-full h-14 fixed top-0 px-4 sm:px-6 bg-white flex items-center justify-between z-50'>
        <div className='w-auto flex flex-row items-center justify-center gap-3'>
            <button onClick={()=>setUserSidebar(!userSidebar)} className='cursor-pointer'>
                {
                    userSidebar? <CiMenuFries size={20} /> : <CiMenuBurger size={20} />
                }
                </button>
        <Link href={'/'} className='text-xl'>Home</Link>
        </div>
        <button className='px-6 p-2 rounded-2xl cursor-pointer bg-sky-500 text-white' onClick={()=>logout()}>Logout</button>
        
      
    </div>
  )
}

export default UserNavbar
