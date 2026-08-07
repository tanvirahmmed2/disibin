'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

const Bio = () => {
  const [stats, setStats] = useState([
    { value: '120+', label: 'Businesses Served', desc: 'across industries worldwide' },
    { value: '50+', label: 'International Brands', desc: 'trusting our solutions' },
    { value: '6+', label: 'Years of Excellence', desc: 'delivering premium results' },
  ])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/public/home')
        const result = response.data
        if (result.success) {
          const { stats: fetchedStats } = result.data
          setStats([
            { value: `${fetchedStats.businesses}+`, label: 'Businesses Served', desc: 'across industries worldwide' },
            { value: `${fetchedStats.projects}+`, label: 'International Brands', desc: 'trusting our solutions' },
            { value: `${fetchedStats.years}+`, label: 'Years of Excellence', desc: 'delivering premium results' },
          ])
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      }
    }
    fetchStats()
  }, [])

  return (
    <section className='w-full flex flex-col items-center justify-center gap-12 p-4 md:p-8 py-20 '>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className='w-full flex flex-col gap-3'
      >
        <h2 className='font-poppins text-3xl sm:text-5xl font-semibold text-slate-900 leading-tight max-w-2xl'>
          A High-Care Studio Built On{' '}
          <span className='text-primary font-bold'>Clarity &amp; Impact</span>
        </h2>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        className='w-full grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 font-poppins'
      >
        {stats.map((s) => (
          <motion.div
            key={s.label}
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className={`
              group relative w-full p-8 rounded-2xl
              glass shadow-sm hover:shadow-xl hover:shadow-primary/10
              transition-all duration-300 cursor-default
              overflow-hidden
            `}
          >
            <div
              aria-hidden='true'
              className='pointer-events-none absolute -top-10 -left-10 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700'
              style={{
                background: 'radial-gradient(circle, rgba(0,128,128,0.15) 0%, transparent 70%)',
              }}
            />

            <p className='text-5xl sm:text-6xl font-semibold text-slate-900 group-hover:text-primary transition-colors duration-300 mb-2'>
              {s.value}
            </p>
            <p className='text-sm font-semibold text-slate-700 mb-1'>{s.label}</p>
            <p className='text-xs text-slate-400'>{s.desc}</p>
          </motion.div>
        ))}
      </motion.div>

    </section>
  )
}

export default Bio