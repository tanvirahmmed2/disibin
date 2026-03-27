
import Bio from '@/component/pages/Bio'
import Intro from '@/component/pages/Intro'
import Review from '@/component/pages/Review'
import Service from '@/component/pages/Service'
import SkillSlider from '@/component/pages/SkillSlider'
import Support from '@/component/pages/Support'
import React from 'react'

const MainPage = () => {
  return (
    <div className='w-full'>
      <Intro/>
      <Bio/>
      <Service/>
      <Review/>
      <SkillSlider/>
      <Support/>
      
    </div>
  )
}

export default MainPage
