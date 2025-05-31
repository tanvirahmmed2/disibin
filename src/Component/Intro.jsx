import React from 'react'

import { Link } from 'react-router-dom'
// import {motion} from 'motion/react';

export default function Intro(props) {
  return (
    <div className='pt-20 h-[100vh]'>
      <div className=' min-h-[80vh] w-full  flex flex-col  items-center justify-center  text-center'>
        <div className='flex flex-col items-center justify-center gap-4 w-full'>
          <h1 className='text-xl'>Hi! Welcome to</h1>
          <h1 className='font-bold text-6xl text-teal-700'>{props.title}</h1>
          <h3 className='text-xl'>Website Designer & Developer Community</h3>
          <p>Our team is dedicated to building fast, reliable, and user-friendly websites for businesses of all sizes. From simple landing pages to full-featured web applications, we use the latest web technologies to create digital experiences that help you grow online. Partner with us to turn your ideas into a strong online presence.</p>


          <div className='flex flex-col md:flex-row  items-center justify-center text-black w-full h-auto mt-4'>
            <div className='relative bg-teal-500 w-50 h-8 overflow-hidden group hover:scale-90'>
              <div className='w-full h-8 bg-teal-700 -z-10 absolute  hidden group-hover:flex' ></div>
              <Link to="/web-dev" className='    w-50 h-8 flex items-center justify-center text-center  hover:text-white px-4'>Web Development</Link>
            </div>
            <div className='relative bg-teal-500 w-50 h-8 overflow-hidden hover:scale-90 group/item'>
              <div className='w-full h-8 bg-teal-700 -z-10 absolute hidden group-hover/item:flex' ></div>
              <Link to='/graphics' className='  w-50 h-8 flex items-center justify-center text-center  hover:text-white  px-4' >Graphics Design</Link>
            </div>
            <div className='relative bg-teal-500 w-50 h-8 overflow-hidden group/item2 hover:scale-90'>
              <div className='w-full h-8 bg-teal-700 -z-10 absolute  hidden group-hover/item2:flex' ></div>
              <Link to='/generator' className='  w-50 h-8 flex items-center justify-center text-center  hover:text-white  px-4'>Online Generator</Link>
            </div>
          </div>
        </div>


      </div>
    </div>
  )
}
