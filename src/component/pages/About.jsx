'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import React from 'react'

const About = () => {
  return (
    <section className="w-full ">
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }} 
        className="w-full max-w-4xl mx-auto px-4 py-24 flex flex-col items-center justify-center gap-10"
      >
        {/* Core Vision Paragraph */}
        <p className="text-xl sm:text-2xl md:text-3xl text-center font-lora text-slate-800 leading-relaxed max-w-3xl cursor-text">
          To deliver premium, enterprise-grade digital solutions that seamlessly integrate design, development, and intelligent automation into a unified global ecosystem. We are committed to empowering multinational organizations with scalable, secure, and innovative technologies that drive efficiency, enhance user experience, and support sustainable long-term growth through strategic collaboration and continuous digital transformation.
        </p>
        
        {/* Animated Action Button */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <Link 
            href="/about" 
            className="inline-block font-poppins font-medium text-lg md:text-xl bg-slate-900 text-white px-8 py-3 rounded-tl-2xl rounded-br-2xl hover:bg-slate-800 shadow-sm transition-colors tracking-wide"
          >
            About us
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default About