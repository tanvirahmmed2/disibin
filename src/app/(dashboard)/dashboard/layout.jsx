import AdminSideBar from '@/component/bar/AdminSideBar'
import React from 'react'

export const metadata={
    title:'Dashboard',
    description:'Dashboard page'
}

const DashboardLayout = ({children}) => {
  return (
    <div className='w-full pl-16 relative'>
      <AdminSideBar/>
      {children}
    </div>
  )
}

export default DashboardLayout
