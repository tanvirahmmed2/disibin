'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Typewriter } from 'react-simple-typewriter'

const Intro = () => {
  return (
    <section className='relative w-full min-h-screen flex items-center justify-center pt-20 bg-white overflow-hidden'>
      {/* Abstract Background Element */}
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-50/50 rounded-full blur-[120px] -z-10' />
      
      <div className='container-custom flex flex-col items-center text-center space-y-10'>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='space-y-4'
        >
          <span className='px-4 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full'>
            Design • Build • Inspire
          </span>
          <h1 className='text-6xl md:text-9xl font-black text-slate-900 tracking-tighter leading-none'>
            Disibin<span className='text-emerald-500'>.</span>
          </h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className='max-w-2xl'
        >
          <h2 className='text-xl md:text-2xl font-bold text-slate-800 mb-6'>
            We 
            <span className='text-emerald-600 px-2 underline decoration-4 underline-offset-8'>
              <Typewriter
                words={['Architect', 'Implement', 'Scale', 'Innovate']}
                loop={0}
                cursor
                cursorStyle='|'
                typeSpeed={80}
                deleteSpeed={50}
                delaySpeed={2000}
              />
            </span>
            Future-Proof Software.
          </h2>
          <p className='text-slate-500 font-medium leading-relaxed text-sm md:text-base'>
            Crafting high-performance digital solutions that help modern businesses grow, adapt, and stand out in a global landscape. Pure code, no fluff.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className='flex flex-wrap items-center justify-center gap-6 pt-4'
        >
          <Link href='/packages' className='btn-primary'>
            Get Started
          </Link>
          <Link href='/projects' className='btn-secondary'>
            View Work
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className='absolute bottom-12 left-1/2 -translate-x-1/2'
      >
        <div className='w-px h-12 bg-linear-to-b from-slate-200 to-transparent' />
      </motion.div>
    </section>
  )
}

export default Intro

