'use client'
import React, { useContext } from 'react'
import Bio from '@/component/pages/Bio'
import Details from '@/component/pages/Details'
import Intro from '@/component/pages/Intro'
import Review from '@/component/pages/Review'
import LatestProjects from '@/component/pages/LatestProjects'
import LatestPackages from '@/component/pages/LatestPackages'
import SkillSlider from '@/component/pages/SkillSlider'
import Support from '@/component/pages/Support'
import Faqs from '@/component/pages/Faqs'



const MainPage = () => {

  return (
    <main className='w-full'>
      <Intro/>
      <Bio/>
      <Details />
      <LatestProjects />
      <Review/>
      <LatestPackages />
      <SkillSlider/>
      <Faqs/>
      <Support/>
    </main>
  )
}

export default MainPage

