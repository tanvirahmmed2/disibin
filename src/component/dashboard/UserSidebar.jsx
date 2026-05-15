'use client'
import React, { useContext } from 'react'
import { Context } from '../helper/Context'
import Link from 'next/link'

const UserSidebar = () => {
  const { userSidebar } = useContext(Context)

  return (
    <div
      className={`fixed top-14 left-0 z-50  min-h-screen py-12 bg-red-300 flex flex-col justify-between gap-1 p-4 transition-transform duration-300 ${
        userSidebar ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className='flex flex-col gap-2'>
        <Link href='/user/profile'>Profile</Link>
        <Link href='/user/tickets'>Tickets</Link>
        <Link href='/user/purchases'>Purchases</Link>
        <Link href='/user/payments'>Payments</Link>
        <Link href='/user/reviews'>Reviews</Link>
      </div>

      <Link href='/user/settings'>Settings</Link>
    </div>
  )
}

export default UserSidebar