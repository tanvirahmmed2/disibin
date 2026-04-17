'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Typewriter } from 'react-simple-typewriter'

const Intro = () => {
  return (
    <section className='relative w-full min-h-screen flex items-center justify-center pt-20 bg-primary overflow-hidden'>
      
      <div className='absolute top-0 left-0 w-full h-full opacity-10'>
        <div className='absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-white rounded-full blur-[150px]' />
        <div className='absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white rounded-full blur-[150px]' />
      </div>
      
      <div className='container-custom flex flex-col items-center text-center space-y-12 relative z-10'>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className='space-y-6'
        >
          <span className='px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] font-black uppercase tracking-[0.4em] rounded-full inline-block'>
            Design • Build • Inspire
          </span>
          <h1 className='text-6xl md:text-[10rem] font-black text-white tracking-tighter leading-[0.85] uppercase'>
            Disibin<span className='text-white/30'>.</span>
          </h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className='max-w-3xl'
        >
          <h2 className='text-xl md:text-3xl font-bold text-white mb-8 leading-tight'>
            We 
            <span className='text-white px-3 relative italic'>
              <Typewriter
                words={['Architect', 'Implement', 'Scale', 'Innovate']}
                loop={0}
                cursor
                cursorStyle='_'
                typeSpeed={80}
                deleteSpeed={50}
                delaySpeed={2000}
              />
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white/30"></span>
            </span>
            Future-Proof Software.
          </h2>
          <p className='text-white/70 font-medium leading-relaxed text-base md:text-lg max-w-2xl mx-auto'>
            Crafting high-performance digital solutions that help modern businesses grow, adapt, and stand out in a global landscape.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className='flex flex-wrap items-center justify-center gap-6 pt-6'
        >
          <Link href='/packages' className='px-12 py-6 bg-white text-primary font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-slate-50 hover:shadow-2xl hover:shadow-white/20 transition-all active:scale-95'>
            Get Started
          </Link>
          <Link href='/projects' className='px-12 py-6 bg-transparent text-white border-2 border-white/20 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white/10 transition-all active:scale-95'>
            View Work
          </Link>
        </motion.div>
      </div>

      
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className='absolute bottom-12 left-1/2 -translate-x-1/2'
      >
        <div className='w-px h-16 bg-white/20' />
      </motion.div>
    </section>
  )
}

export default Intro

