'use client'
import Link from 'next/link'
import React from 'react'
import { RiHome5Line, RiProductHuntLine, RiShoppingCart2Line, RiRefund2Line, RiAlertLine, RiUser3Line, RiTruckLine, RiSettings3Line, RiFileChartLine, RiArchiveLine, RiPriceTag3Line, RiShoppingBag3Line, RiUserAddLine, RiUserCommunityLine } from "react-icons/ri"
import { TbReport, TbMoneybag, TbReportMoney, TbReportAnalytics, TbReportSearch } from "react-icons/tb"
import { usePathname } from 'next/navigation'
import { BiPurchaseTagAlt } from "react-icons/bi"
import { BsFillHouseGearFill } from "react-icons/bs"
import { MdChevronRight } from "react-icons/md";
import { CiBoxList } from "react-icons/ci";

const MenuItem = ({ href, icon: Icon, label }) => {
  const pathname = usePathname()
  const isActive = pathname === href
  return (
    <Link href={href} className={`group font-serif flex opacity-80 flex-row gap-4 items-center px-2 py-1 transition-all ${isActive ? 'bg-teal-500 text-white' : 'hover:bg-teal-600 hover:text-white'}`}>
      <Icon size={14} />
      <span className="hidden group-hover:inline whitespace-nowrap">{label}</span>
    </Link>
  )
}

const DashboardSidebar = () => {
  return (
    <aside className="group select-none fixed top-0 left-0 z-50 bg-white h-screen w-16 hover:w-60 border-r-2  transition-all duration-300 p-2 flex flex-col gap-4 overflow-y-auto py-8">
      <div className="pb-5 text-xl">
        <MenuItem href="/dashboard" icon={RiHome5Line} label="Dashboard Panel" />
      </div>
      
      <div>
        <MenuItem href="/dashboard/new-project" icon={RiUser3Line} label="New Project" />
        <MenuItem href="/dashboard/projects" icon={CiBoxList} label="Projects" />
        <MenuItem href="/dashboard/new-blog" icon={RiUser3Line} label="New Blog" />
        <MenuItem href="/dashboard/blogs" icon={CiBoxList} label="Blogs" />
        <MenuItem href="/dashboard/new-package" icon={RiUser3Line} label="New Packages" />
        <MenuItem href="/dashboard/packages" icon={CiBoxList} label="Packages" />
        <MenuItem href="/profile" icon={RiUser3Line} label="Account" />
        <MenuItem href="/dashboard/new-review" icon={RiUserCommunityLine} label="New Review" />
        <MenuItem href="/dashboard/reviews" icon={RiUserCommunityLine} label="Reviews" />
        <MenuItem href="/dashboard/messages" icon={RiUserCommunityLine} label="Messages" />
        <MenuItem href="/dashboard/settings" icon={RiSettings3Line} label="Setting" />
        <MenuItem href="/dashboard/help" icon={TbReport} label="Help" />
      </div>
    </aside>
  )
}

export default DashboardSidebar
