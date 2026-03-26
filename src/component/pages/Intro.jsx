'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Typewriter } from 'react-simple-typewriter'

const Intro = () => {
  return (
    <div className='relative w-full min-h-200 flex flex-col items-center justify-center gap-6 px-4 text-white text-center overflow-hidden'>

      <Image
        src='/bg.jpeg'
        alt='bg'
        fill
        priority
        className='absolute -z-20 object-cover scale-110 blur-[3px]'
      />

      <div className='absolute inset-0 -z-10 bg-linear-to-b from-black/10  to-teal-900/80'></div>

      <p className='tracking-widest text-sm sm:text-base text-gray-300 uppercase'>
        A Leading Software Development Company
      </p>

      <h1 className='text-4xl sm:text-6xl md:text-8xl font-extrabold text-teal-400 drop-shadow-lg'>
        <Typewriter
          words={[
            'Disibin',
            'Design • Build • Inspire',
            'Creative • Responsive • Powerful',
            'Ideas • Code • Impact',
          ]}
          loop={0}
          cursor
          cursorStyle='_'
          typeSpeed={70}
          deleteSpeed={40}
          delaySpeed={1400}
        />
      </h1>

      <p className='max-w-3xl text-gray-200 text-base sm:text-lg md:text-xl leading-relaxed'>
        We craft innovative, scalable, and high-performance digital solutions
        that help businesses grow, adapt, and stand out globally.
      </p>

      <div className='flex gap-4 mt-6'>
        <Link href={'/packages'} className='px-6 py-3 rounded-full bg-teal-500 hover:bg-teal-600 transition font-semibold text-black'>
          Get Started
        </Link>
        <Link href={'/projects'} className='px-6 py-3 rounded-full border border-teal-400 hover:bg-teal-400/10 transition font-semibold'>
          View Work
        </Link>
      </div>

    </div>
  )
}

export default Intro
