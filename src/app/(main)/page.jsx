import About from '@/component/public/pages/About'
import Bio from '@/component/public/pages/Bio'
import Hero from '@/component/public/pages/Hero'
import Intro from '@/component/public/pages/Intro'
import Partners from '@/component/public/pages/Partners'
import Reviews from '@/component/public/pages/Reviews'
import Services from '@/component/public/pages/Services'
import React from 'react'

export const metadata = {
  title: 'Disibin | Enterprise-Grade Digital Systems & Software',
  description: 'Disibin builds robust, high-performance web systems, custom applications, and cloud-native solutions designed for scale and security.',
};

const MainPage = () => {

  return (
    <main className='w-full min-h-200  flex flex-col '>
      <Hero/>
      <Intro />
      <Bio />
      <About />
      <Services/>
      <Reviews />
      <Partners />
    </main>
  )
}

export default MainPage

