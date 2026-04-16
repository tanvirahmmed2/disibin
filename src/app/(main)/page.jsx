'use client'
import React, { useContext } from 'react'
import Bio from '@/component/pages/Bio'
import Details from '@/component/pages/Details'
import Intro from '@/component/pages/Intro'
import Review from '@/component/pages/Review'
import SkillSlider from '@/component/pages/SkillSlider'
import Support from '@/component/pages/Support'
import { Context } from '@/component/helper/Context'
import { FaFigma, FaCode, FaAndroid } from 'react-icons/fa'

const servicesData = [
  {
    id: 1,
    title: "Website Design",
    description: "Clean, modern, and user-friendly UI/UX designs focused on usability, branding, and seamless experience across all devices.",
    icon: <FaFigma />,
  },
  {
    id: 2,
    title: "Website Development",
    description: "High-performance, scalable websites built with clean code, best practices, and modern technologies for speed and reliability.",
    icon: <FaCode />,
  },
  {
    id: 3,
    title: "Android App Development",
    description: "Custom Android applications designed for performance, smooth user experience, and long-term maintainability.",
    icon: <FaAndroid />,
  },
];

const MainPage = () => {
  const { customServices } = useContext(Context)

  return (
    <main className='w-full'>
      <Intro/>
      <Bio/>
      <Details 
        services={servicesData} 
        customSections={customServices}
      />
      <Review/>
      <SkillSlider/>
      <Support/>
    </main>
  )
}

export default MainPage

