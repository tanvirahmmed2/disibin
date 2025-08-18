import React from 'react'
import Intro from '../pages/Intro'
import About from '../pages/About'
import Contact from '../pages/Contact'
import UsePageTitle from '../component/UsePageTitle'
import Service from '../pages/Service'
import Projects from '../pages/Projects'


const Home = () => {
  UsePageTitle("Home")
  return (
    <div className='w-full'>
      <Intro/>
      <Service/>
      <Projects/>
      <About/>

      <Contact/>
    </div>
  )
}

export default Home
