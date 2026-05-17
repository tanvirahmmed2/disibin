'use client'
import React, { useContext } from 'react'
import { Context } from '@/component/helper/Context'

const UserPage = () => {
  const { userData } = useContext(Context)

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-20 px-4 text-center">
      <h1 className="text-4xl font-bold mb-4 bg-linear-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
        Welcome Back, {userData?.name || 'User'}!
      </h1>
      <p className="text-slate-500 max-w-md">
        This is your personal dashboard where you can track your projects, purchases, and tickets.
      </p>
      
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl">
        <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
          <p className="text-3xl font-bold text-slate-900">0</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Active Projects</p>
        </div>
        <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
          <p className="text-3xl font-bold text-slate-900">0</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Pending Tickets</p>
        </div>
        <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
          <p className="text-3xl font-bold text-slate-900">0</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Total Purchases</p>
        </div>
      </div>
    </div>
  )
}

export default UserPage
