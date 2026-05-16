import Footer from '@/component/bar/Footer'
import Navbar from '@/component/bar/Navbar'
import Sidebar from '@/component/bar/Sidebar'
import { ManagementRole } from '@/lib/middleware'
import { redirect } from 'next/navigation'
import React from 'react'

export const metadata={
    title:'Home | Disibin',
    description:'Disibin home Page'
}

const  HomeLayout = async({children}) => {
  return (
    <div className='w-full relative pt-16 flex flex-col items-center justify-between min-h-screen'
      style={{
        background:
          'radial-gradient(ellipse 70% 50% at 10% 10%, rgba(14,165,233,0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 90% 80%, rgba(99,102,241,0.05) 0%, transparent 60%), #f0f9ff',
      }}
    >
      <Navbar/>
      <Sidebar/>
      {children}
      <Footer/>
    </div>
  )
}

export default HomeLayout
