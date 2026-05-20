'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import React from 'react'

const About = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: .6 }} className='w-full max-w-4xl mx-auto h-auto py-20 flex flex-col items-center justify-center gap-6'>
      <p className='text-2xl sm:text-4xl text-center font-lora cursor-text'>To deliver premium, enterprise-grade digital solutions that seamlessly integrate design, development, and intelligent automation into a unified global ecosystem. We are committed to empowering multinational organizations with scalable, secure, and innovative technologies that drive efficiency, enhance user experience, and support sustainable long-term growth through strategic collaboration and continuous digital transformation</p>
      <Link href={'/about'} className='w-auto text-2xl md:text-4xl font-poppins bg-slate-700 text-white px-6 rounded-tl-2xl rounded-br-2xl'>About us</Link>
    </motion.div>
  )
}

export default About
