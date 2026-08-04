import About from '@/component/public/pages/About'
import Bio from '@/component/public/pages/Bio'
import FAQ from '@/component/public/pages/FAQ'
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
    <main className='w-full min-h-200 p-4 md:p-8 flex flex-col gap-4 pb-20'>
      <Intro />
      <Bio />
      <About />
      <Services/>
      <FAQ/>
      <Reviews />
      <Partners />
    </main>
  )
}

export default MainPage

