'use client'
import Link from 'next/link'
import React, { useContext } from 'react'
import { Context } from '../helper/Context'

import { MdOutlineMenu } from "react-icons/md";
import { CiMenuFries } from "react-icons/ci";

const Navbar = () => {
  const {sidebar, setSidebar, isLoggedin}= useContext(Context)
  
  
  return (
    <nav className='w-full fixed top-0 right-0 h-16 bg-white shadow z-50 flex flex-row items-center justify-around text-teal-800'>
      <button onClick={()=>setSidebar(!sidebar)} className='flex sm:hidden text-2xl cursor-pointer'>
        {
          sidebar? <CiMenuFries/>:<MdOutlineMenu/>
        }
      </button>
      <Link href={'/'} className='text-3xl font-semibold w-50'>Disibin</Link>

      <div className='hidden sm:flex w-auto flex-row items-center justify-center gap-2'>
        <Link href={'/packages'} className='w-auto h-16 flex items-center justify-center hover:bg-gray-100 px-6 transition ease-in-out duration-500'>Pricing</Link>
        <Link href={'/projects'} className='w-auto h-16 flex items-center justify-center hover:bg-gray-100 px-6 transition ease-in-out duration-500'>Projects</Link>
        <Link href={'/reviews'} className='w-auto h-16 flex items-center justify-center hover:bg-gray-100 px-6 transition ease-in-out duration-500'>Reviews</Link>
        <Link href={'/blogs'} className='w-auto h-16 flex items-center justify-center hover:bg-gray-100 px-6 transition ease-in-out duration-500'>Blogs</Link>
        <Link href={'/about'} className='w-auto h-16 flex items-center justify-center hover:bg-gray-100 px-6 transition ease-in-out duration-500'>About</Link>
        {
          isLoggedin? <Link href={'/profile'} className='w-auto h-16 flex items-center justify-center hover:bg-gray-100 px-6 transition ease-in-out duration-500'>Profile</Link>
          :
          <Link href={'/login'} className='w-auto h-16 flex items-center justify-center hover:bg-gray-100 px-6 transition ease-in-out duration-500'>Login</Link>
        }
        
      </div>

    </nav>
  )
}

export default Navbar
