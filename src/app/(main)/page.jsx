import About from '@/component/pages/About'
import Bio from '@/component/pages/Bio'
import CaseStudies from '@/component/pages/CaseStudies'
import FAQ from '@/component/pages/FAQ'
import Intro from '@/component/pages/Intro'
import Partners from '@/component/pages/Partners'
import Reviews from '@/component/pages/Reviews'
import Services from '@/component/pages/Services'
import React from 'react'

export const metadata = {
  title: 'Disibin | Enterprise-Grade Digital Systems & Software',
  description: 'Disibin builds robust, high-performance web systems, custom applications, and cloud-native solutions designed for scale and security.',
};

const MainPage = () => {

  return (
    <main className='w-full min-h-screen px-4 sm:px-8 lg:px-12  mx-auto flex flex-col gap-4 pb-20'>
      <Intro />
      <Bio />
      <About />
      <Services/>
      <CaseStudies/>
      <FAQ/>
      <Reviews />
      <Partners />
    </main>
  )
}

export default MainPage

