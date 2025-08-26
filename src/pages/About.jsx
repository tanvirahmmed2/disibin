import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'

import UsePageTitle from "../component/UsePageTitle"

import { FaCaretLeft, FaCaretRight, FaRegStar } from "react-icons/fa";
const review=[
  {
    id:1,
    name: "Mia, NorthPoint Consulting",
    comment: "They handled everything and launched in a week. Our bookings doubled."
  },
  {
    id:2,
    name: "Aaron, FlowSync",
    comment: "Clean, fast, and easy to update. Exactly what we needed."
  },
  {
    id:3,
    name: " Priya, Bean & Bloom",
    comment: "Great communication and super clear process."
  },
]


const About = () => {
  UsePageTitle("About")
  const [index, setIndex]= useState(0)
  
  const nextreview=()=>{
    setIndex((prevIndex) => (prevIndex + 1) % review.length)

  }
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % review.length);
    }, 2500); 

    return () => clearInterval(timer); 
  }, []);


  const prevreview=()=>{
    setIndex((prevIndex) => (prevIndex - 1 + review.length) % review.length)
  }


  return (
    <section className="w-full mt-20  min-h-screen p-8 flex flex-col gap-12 items-center justify-start">
      <h1 className='w-full text-4xl font-semibold text-center'>About</h1>


      <div className='w-full flex flex-col lg:flex-row items-center justify-center gap-8 '>

        <div className='w-full flex flex-col gap-2 items-start justify-center'>
          <h1 className='font-semibold text-3xl'>A small studio with big care</h1>
          <p>We’re a tight-knit team focused on clarity, speed, and friendly collaboration. No fluff—just websites that work hard for your business.</p>
          
        </div>

        <div className='w-full text-center p-2 shadow-sm shadow-indigo-400 flex flex-row items-center justify-center gap-2 border-2 border-red-500 rounded-xl border-opacity-20'>
          <motion.div initial={{scale:0.9, opacity:0}} whileInView={{scale:1, opacity:1}} transition={{duration:0.5}} className='w-full flex flex-col items-center justify-center h-[150px] bg-white/5 rounded-lg text-xl font-semibold'>
            <p>20+</p>
            <p>Projects shipped</p>
          </motion.div>
          <motion.div initial={{scale:0.9, opacity:0}} whileInView={{scale:1, opacity:1}} transition={{duration:0.5}} className='w-full flex flex-col items-center justify-center h-[150px] bg-white/5 rounded-lg text-xl font-semibold'>
            <p className='flex items-center gap-1 text-amber-500'>5 <FaRegStar/></p>
            <p>Customers rated</p>
          </motion.div>
          <motion.div initial={{scale:0.9, opacity:0}} whileInView={{scale:1, opacity:1}} transition={{duration:0.5}} className='w-full flex flex-col items-center justify-center h-[150px] bg-white/5 rounded-lg text-xl font-semibold'>
            <p>100%</p>
            <p>Remote friendly</p>
          </motion.div>

        </div>
      </div>


      <div className='w-full p-4 lg:p-8 h-auto gap-8 flex flex-col items-center justify-center shadow-sm shadow-indigo-500 border-2 border-red-500 rounded-xl border-opacity-20'>
        
        <div className='w-full flex flex-row items-center justify-between'>
          <h1 className='text-2xl font-semibold'>Testimonials</h1>
          <div className='w-auto flex flex-row gap-4 items-center'>
            <p className='px-4 bg-white/5 p-1 rounded-lg cursor-pointer' onClick={prevreview}><FaCaretLeft/></p>
            <p className='px-4 bg-white/5 p-1 rounded-lg cursor-pointer' onClick={nextreview}><FaCaretRight/></p>
          </div>
        </div>
        
        <div className='w-full flex flex-col items-center justify-center'>
          <p>"{review[index].comment}"</p>
          <p>--- {review[index].name}</p>
        </div>

      </div>

      <div className='w-full gap-4 flex flex-col'>
        <p>DisiBin, is a dynamic and forward-thinking digital agency committed to transforming ideas into impactful digital experiences. We provide end-to-end services that blend strategy, creativity, and technology to help businesses thrive in the modern digital landscape.</p>
        <p>Our mission is to empower businesses—big or small—to succeed onne. We believe in honest communication, long-term partnerships, and devering measurable results. Whether you’re launching a new product, redesigning your website, or building a brand from scratch, our team is here to make it happen.</p>
      </div>

      
      <div className='w-full flex flex-col items-center justify-center gap-6'>
        <p className='text-xl'>Let’s collaborate and bring your vision to fe with creativity, code, and clarity.</p>
        <div className="w-full flex flex-row items-center justify-center gap-4">
            <Link
              to="/projects"
              className="bg-indigo-900 rounded-lg hover:shadow-2xl hover:scale-105 shadow-green-600 px-4"
            >
              See our work
            </Link>
            <Link
              to="/contact"
              className="bg-white/10 rounded-lg hover:shadow-2xl hover:scale-105 shadow-indigo-600 px-4"
            >
              Message
            </Link>
          </div>
      </div>

    </section>
  )
}

export default About
