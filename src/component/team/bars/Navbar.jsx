'use client'
import React, { useContext } from 'react'
import Link from 'next/link'
import { Context } from '../../helper/Context'
import { CiMenuBurger, CiMenuFries } from 'react-icons/ci'

const Navbar = () => {
  const { dashboardSidebar, setDashboardSidebar, teamData, teamLogout } = useContext(Context)

  return (
    <header className="w-full h-14 fixed top-0 left-0 right-0 px-4 sm:px-6 bg-white border-b border-slate-100 shadow-sm flex items-center justify-between z-50">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setDashboardSidebar(!dashboardSidebar)}
          className="cursor-pointer p-1.5 rounded-lg hover:bg-slate-100 transition-colors lg:hidden"
          aria-label="Toggle sidebar"
        >
          {dashboardSidebar ? <CiMenuFries size={20} /> : <CiMenuBurger size={20} />}
        </button>
        <Link href="/team" className="text-xl font-semibold text-slate-800 tracking-tight">
          Management
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {teamData?.name && (
          <span className="hidden sm:block text-sm text-slate-500 font-medium">
            {teamData.name}
          </span>
        )}
        <button
          onClick={teamLogout}
          className="px-4 py-1.5 rounded-xl cursor-pointer bg-primary hover:bg-primary-dark text-white text-xs font-bold transition-all shadow-md shadow-primary/20"
        >
          Logout
        </button>
      </div>
    </header>
  )
}

export default Navbar
