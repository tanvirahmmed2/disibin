import Bio from '@/component/pages/Bio'
import HappyCustomers from '@/component/pages/HappyCustomers'
import Intro from '@/component/pages/Intro'
import Service from '@/component/pages/Service'
import SkillSlider from '@/component/pages/SkillSlider'
import Support from '@/component/pages/Support'
import Team from '@/component/pages/Team'
import React from 'react'

const MainPage = () => {
  return (
    <div className='w-full'>
      <Intro/>
      <Bio/>
      <Service/>
      <SkillSlider/>
      <HappyCustomers/>
      <Team/>
      <Support/>
      
    </div>
  )
}

export default MainPage
