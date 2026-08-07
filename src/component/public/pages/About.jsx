'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import React from 'react'


const highlights = [
  { value: 'Enterprise-grade', label: 'Architecture' },
  { value: 'Scalable', label: 'by Design' },
  { value: 'Global', label: 'Ecosystem' },
]

const About = () => {
  return (
    <section className="w-full py-20 my-4 overflow-hidden relative p-4 md:p-8 bg-primary text-tertiary-light">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle, #008080 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 px-4 max-w-7xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          className="w-full flex flex-col items-center text-center gap-8 max-w-4xl mx-auto"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.3em]  font-poppins">
            Who We Are
          </span>

          <p className="text-xl sm:text-2xl lg:text-3xl font-poppins text-tertiary-light leading-relaxed">
            To deliver{' '}
            <span className=" font-semibold">premium, enterprise-grade</span>{' '}
            digital solutions that seamlessly integrate design, development, and intelligent automation into a unified global ecosystem — empowering organisations with scalable, secure, and innovative technologies that drive{' '}
            <span className=" font-semibold">sustainable long-term growth.</span>
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {highlights.map((h, i) => (
              <motion.div
                key={h.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ delay: i * 0.1 + 0.2, duration: 0.5 }}
                className="bg-tertiary rounded-2xl px-6 py-4 flex flex-col items-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-default"
              >
                <span className="text-lg font-bold text-tertiary-dark font-poppins">{h.value}</span>
                <span className="text-xs text-tertiary-dark font-poppins mt-0.5">{h.label}</span>
              </motion.div>
            ))}
          </div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.2 }}>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 font-poppins font-semibold text-sm bg-secondary text-white px-8 py-3.5 rounded-xl hover:bg-primary-dark shadow-md shadow-primary/20 transition-all duration-300 animate-pulse-glow"
            >
              About Us →
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default About