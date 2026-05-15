import Link from 'next/link'
import React from 'react'

const About = () => {
  return (
    <div className='w-full max-w-4xl mx-auto h-auto py-20 flex flex-col items-center justify-center gap-6'>
      <p className='text-2xl sm:text-4xl text-center font-poppins cursor-text'>To deliver premium, enterprise-grade digital solutions that seamlessly integrate design, development, and intelligent automation into a unified global ecosystem. We are committed to empowering multinational organizations with scalable, secure, and innovative technologies that drive efficiency, enhance user experience, and support sustainable long-term growth through strategic collaboration and continuous digital transformation</p>
      <Link href={'/about'} className='w-auto text-4xl font-silkscreen'>About us</Link>
    </div>
  )
}

export default About
