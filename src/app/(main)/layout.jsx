import Footer from '@/component/bar/Footer'
import Navbar from '@/component/bar/Navbar'
import Sidebar from '@/component/bar/Sidebar'
import React from 'react'

export const metadata={
    title:'Home ',
    description:'Home Page'
}

const HomeLayout = ({children}) => {
  return (
    <div className='w-full relative pt-16 flex flex-col items-center justify-between min-h-screen'>
      <Navbar/>
      <Sidebar/>
      {children}
      <Footer/>
    </div>
  )
}

export default HomeLayout
