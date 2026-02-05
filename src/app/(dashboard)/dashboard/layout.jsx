
import DashboardSidebar from '@/component/bar/DashboardSideBar'
import React from 'react'

export const metadata={
    title:'Dashboard',
    description:'Dashboard page'
}

const DashboardLayout = ({children}) => {
  return (
    <div className='w-full pl-16 relative'>
      <DashboardSidebar/>
      {children}
    </div>
  )
}

export default DashboardLayout
