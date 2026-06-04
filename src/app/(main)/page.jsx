'use client'
import About from '@/component/pages/About'
import Bio from '@/component/pages/Bio'
import CaseStudies from '@/component/pages/CaseStudies'
import FAQ from '@/component/pages/FAQ'
import Intro from '@/component/pages/Intro'
import Partners from '@/component/pages/Partners'
import Reviews from '@/component/pages/Reviews'
import Services from '@/component/pages/Services'
import Team from '@/component/pages/Team'
import React from 'react'


const MainPage = () => {

  return (
    <main className='w-full min-h-screen px-4 sm:px-8 lg:px-12  mx-auto flex flex-col gap-4 pb-20'>
      <Intro />
      <Bio />
      <About />
      <Services/>
      <CaseStudies/>
      <Team/>
      <FAQ/>
      <Reviews />
      <Partners />
    </main>
  )
}

export default MainPage

