import React from 'react'
import Intro from '../pages/Intro'
import About from '../pages/About'
import Contact from '../pages/Contact'
import UsePageTitle from '../component/UsePageTitle'
import Services from '../pages/Services'
import Projects from '../pages/Projects'


const Home = () => {
  UsePageTitle("Home")
  return (
    <div className='w-full h-auto flex flex-col items-center justify-center gap-32 my-32'>
      <Intro/>
      <Services/>
      <Projects/>
      <About/>

      <Contact/>
    </div>
  )
}

export default Home
