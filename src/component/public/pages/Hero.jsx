'use client'
import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

const Hero = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      className="w-full min-h-200 flex flex-col items-center justify-center gap-6 p-4 md:p-6 relative overflow-hidden"
    >
      <motion.div variants={itemVariants} className="w-auto flex flex-col items-center justify-center gap-2 text-center">
        <p className="text-5xl md:text-8xl font-bold font-poppins text-slate-900 tracking-tight">
          We Build <span className="text-primary font-bold">Brands</span>
        </p>
        <p className="text-5xl md:text-7xl font-semibold font-poppins text-slate-800 tracking-tight">
          You Build <span className="text-secondary font-bold">Success</span>
        </p>
      </motion.div>

      <motion.p
        variants={itemVariants}
        className="w-full max-w-2xl text-center text-slate-600 font-poppins text-base md:text-lg leading-relaxed"
      >
        From concept to premium digital solutions — crafting fast, scalable web
        applications that seamlessly combine design, development, and automation
        into one powerful ecosystem. Long-term partnerships, continuous growth.
      </motion.p>

      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 items-center mt-2">
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white font-poppins font-semibold px-8 py-3.5 rounded-xl shadow-md shadow-primary/20 transition-colors min-w-[200px]"
          >
            Get Started
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center border border-slate-300 hover:border-primary text-slate-800 hover:text-primary font-poppins font-semibold px-8 py-3.5 rounded-xl transition-all min-w-[200px]"
          >
            View Work
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default Hero
