import Footer from '@/component/public/bars/Footer'
import Navbar from '@/component/public/bars/Navbar'
import Sidebar from '@/component/public/bars/Sidebar'
import React from 'react'

export const metadata={
    title:'Home | Disibin',
    description:'Disibin home Page'
}

const  HomeLayout = async({children}) => {
  return (
    <div className='w-full relative flex flex-col items-center justify-between min-h-screen font-lora'
      
    >
      <Navbar/>
      <Sidebar/>
      {children}
      <Footer/>
    </div>
  )
}

export default HomeLayout
