'use client'
import React from 'react'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

const Intro = () => {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      className='w-full relative flex flex-col gap-12 items-start bg-primary text-tertiary-light justify-center p-4 md:p-8 py-40 overflow-hidden'
    >
      <div className="relative z-10 w-full flex flex-col gap-12">
        <motion.div variants={itemVariants} className='w-full flex flex-col gap-4'>
          <p className='font-poppins text-lg sm:text-xl tracking-wide'>
            We build technology
          </p>
          <h1 className='font-poppins text-5xl sm:text-7xl lg:text-8xl font-semibold leading-[1.08] tracking-tight '>
            that{' '}
            <span className=''>works,</span>
            <br />
            scales, and{' '}
            <span className=''>performs</span>
          </h1>
        </motion.div>

        <motion.div variants={itemVariants} className='w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8'>
          <p className='max-w-md font-poppins text-sm sm:text-base leading-relaxed'>
            Digital Solutions &amp; Business Innovation Network
          </p>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default Intro