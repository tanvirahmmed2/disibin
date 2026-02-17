
import DashboardSidebar from '@/component/bar/DashboardSideBar'
import { isManager } from '@/lib/middleware'
import { redirect } from 'next/navigation'
import React from 'react'

export const metadata={
    title:'Dashboard',
    description:'Dashboard page'
}

const DashboardLayout = async({children}) => {
  const auth=await isManager()
  if(!auth.success) return redirect('/')

  return (
    <div className='w-full pl-16 relative'>
      <DashboardSidebar/>
      {children}
    </div>
  )
}

export default DashboardLayout
