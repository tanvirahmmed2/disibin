'use client'
import Link from 'next/link'
import React, { useContext } from 'react'
import { Context } from '../helper/Context'

const Sidebar = () => {
    const { sidebar, setSidebar, isLoggedin } = useContext(Context)
    const closeSidebar = () => {
        setSidebar(!sidebar)
    }
    return (
        <div className={`w-40 transition ease-in-out duration-500 ${sidebar ? 'translate-x-0' : '-translate-x-full'} sm:-translate-x-full fixed top-16 left-0 h-[calc(100vh-4rem)] p-4 border-r bg-white z-40 flex flex-col gap-2`}>
            <Link href={'/'} className='w-auto hover:px-4 ease-in-out duration-500' onClick={closeSidebar}>Home</Link>
            <Link href={'/packages'} className='w-auto hover:px-4 ease-in-out duration-500' onClick={closeSidebar}>Pricing</Link>
            <Link href={'/projects'} className='w-auto hover:px-4 ease-in-out duration-500' onClick={closeSidebar}>Projects</Link>
            <Link href={'/reviews'} className='w-auto hover:px-4 ease-in-out duration-500' onClick={closeSidebar}>Reviews</Link>
            <Link href={'/blogs'} className='w-auto hover:px-4 ease-in-out duration-500' onClick={closeSidebar}>Blogs</Link>
            <Link href={'/about'} className='w-auto hover:px-4 ease-in-out duration-500' onClick={closeSidebar}>About</Link>
            {
                isLoggedin ?
                    <div className='flex flex-col gap-2'>
                        <Link href={'/profile'} className='w-auto hover:px-4 ease-in-out duration-500' onClick={closeSidebar}>Profile</Link>
                        <Link href={'/wishlist'} className='w-auto hover:px-4 ease-in-out duration-500' onClick={closeSidebar}>Wishlist</Link>

                    </div>
                    :
                    <div className='flex flex-col gap-2'>
                        <Link href={'/login'} className='w-auto hover:px-4 ease-in-out duration-500' onClick={closeSidebar}>Login</Link>
                        <Link href={'/register'} className='w-auto hover:px-4 ease-in-out duration-500' onClick={closeSidebar}>Register</Link>
                    </div>
            }

        </div>
    )
}

export default Sidebar
