'use client'
import AddReviewForm from '@/component/forms/AddReviewForm'
import { Context } from '@/component/helper/Context'
import Bio from '@/component/pages/Bio'
import Intro from '@/component/pages/Intro'
import Service from '@/component/pages/Service'
import SkillSlider from '@/component/pages/SkillSlider'
import Support from '@/component/pages/Support'
import React, { useContext } from 'react'

const MainPage = () => {
  const {isLoggedin}= useContext(Context)
  return (
    <div className='w-full'>
      <Intro/>
      <Bio/>
      <Service/>
      <SkillSlider/>
      <Support/>
      {isLoggedin && <AddReviewForm/>}
      
    </div>
  )
}

export default MainPage
