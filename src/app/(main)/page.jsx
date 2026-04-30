'use client'
import React, { useContext } from 'react'
import Bio from '@/component/pages/Bio'
import Details from '@/component/pages/Details'
import Intro from '@/component/pages/Intro'
import Review from '@/component/pages/Review'
import SkillSlider from '@/component/pages/SkillSlider'
import Support from '@/component/pages/Support'
import Faqs from '@/component/pages/Faqs'



const MainPage = () => {

  return (
    <main className='w-full'>
      <Intro/>
      <Bio/>
      <Details />
      <Review/>
      <SkillSlider/>
      <Faqs/>
      <Support/>
    </main>
  )
}

export default MainPage

