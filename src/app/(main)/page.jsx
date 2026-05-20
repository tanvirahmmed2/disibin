'use client'
import About from '@/component/pages/About'
import Bio from '@/component/pages/Bio'
import Intro from '@/component/pages/Intro'
import Reviews from '@/component/pages/Reviews'
import React from 'react'
import ProductsPage from './products/page'


const MainPage = () => {

  return (
    <main className='w-full min-h-screen px-4 sm:px-8 lg:px-12  mx-auto flex flex-col gap-4 pb-20'>
      <Intro />
      <Bio />
      <About />
      <ProductsPage/>
      <Reviews />
    </main>
  )
}

export default MainPage

