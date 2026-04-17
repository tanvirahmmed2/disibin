'use client'
import React, { useState } from 'react'
import { FaCaretDown, FaRegStar } from 'react-icons/fa'
import { motion } from 'framer-motion'

const AboutPage = () => {
  const [firstfaq, setFirstFaq] = useState(false);
  const [secondfaq, setSecondFaq] = useState(false);
  const [thirdfaq, setThirdFaq] = useState(false);
  const handlefirstfaq = () => {
    setFirstFaq(!firstfaq);
  };
  const handlesecondfaq = () => {
    setSecondFaq(!secondfaq);
  };
  const handlethirdfaq = () => {
    setThirdFaq(!thirdfaq);
  };
  return (
    <div className='w-full min-h-screen  py-8 flex flex-col gap-6 items-center justify-center'>
      <h1 className='text-2xl font-semibold text-center'>About us</h1>
     

      <div className='w-full p-4 bg-linear-to-br from-emerald-500 to-emerald-400 text-white text-center py-5 flex flex-col gap-4'>
        <p className='text-center w-full font-semibold'>DisiBin, is a dynamic and forward-thinking digital agency committed to transforming ideas into impactful digital experiences. We provide end-to-end services that blend strategy, creativity, and technology to help businesses thrive in the modern digital landscape.</p>
        <p className='text-center w-full font-semibold'>Our mission is to empower businesses—big or small—to succeed onne. We believe in honest communication, long-term partnerships, and devering measurable results. Whether you’re launching a new product, redesigning your website, or building a brand from scratch, our team is here to make it happen.</p>


      </div>
      <div className="w-full p-4 flex flex-col lg:flex-row items-center justify-center gap-8">
        <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="w-full flex flex-col gap-8 items-center justify-center">
          <div className="w-full h-30 p-4 flex flex-row items-center justify-start gap-2 shadow  border border-emerald-500 rounded-xl border-opacity-20">
            <p className="text-2xl px-3 py-1 rounded-full bg-white/10">1</p>
            <div>
              <h1 className="text-2xl font-semibold">Discover</h1>
              <p>
                We learn about your goals, audience, and content. Quick call +
                checklist
              </p>
            </div>
          </div>
          <div className="w-full h-30 p-4 flex flex-row items-center justify-start gap-2 shadow  border border-emerald-500 rounded-xl border-opacity-20">
            <p className="text-2xl px-3 py-1 rounded-full bg-white/10">2</p>
            <div>
              <h1 className="text-2xl font-semibold">Design</h1>
              <p>Homepage first, then inner pages. Feedback at every step</p>
            </div>
          </div>
          <div className="w-full h-30 p-4 flex flex-row items-center justify-start gap-2 shadow  border border-emerald-500 rounded-xl border-opacity-20">
            <p className="text-2xl px-3 py-1 rounded-full bg-white/10">3</p>
            <div>
              <h1 className="text-2xl font-semibold">Build & Launch</h1>
              <p>We set up hosting, connect your domain, and go live</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="w-full h-auto p-2 flex-col flex items-center justify-center  gap-8">
          <h1 className="text-2xl">FAQs</h1>
          <div className="w-full p-4 shadow  flex flex-col gap-2 border border-emerald-500 rounded-xl border-opacity-20">
            <div className="w-full flex flex-row items-center justify-between">
              <p>Do you write copy?</p>
              <p onClick={handlefirstfaq} className={`cursor-pointer`}>
                <FaCaretDown />
              </p>
            </div>
            <p className={` ${firstfaq ? "block" : "hidden"}`}>
              Yes, we can help with messaging, headlines, and structure.
            </p>
          </div>
          <div className="w-full p-4 shadow  flex flex-col gap-2 border border-emerald-500 rounded-xl border-opacity-20">
            <div className="w-full flex flex-row items-center justify-between">
              <p>What tools do you use?</p>
              <p onClick={handlesecondfaq} className={`cursor-pointer `}>
                <FaCaretDown />
              </p>
            </div>
            <p className={` ${secondfaq ? "block" : "hidden"}`}>
              Simple, dependable tools to keep things fast and stable.
            </p>
          </div>
          <div className="w-full p-4 shadow  flex flex-col gap-2 border border-emerald-500 rounded-xl border-opacity-20">
            <div className="w-full flex flex-row items-center justify-between">
              <p>How fast can we launch?</p>
              <p onClick={handlethirdfaq} className={`cursor-pointer `}>
                <FaCaretDown />
              </p>
            </div>
            <p className={` ${thirdfaq ? "block" : "hidden"}`}>
              Most E-commerce websites: 2-4 weeks. Small websites: 2–4 days.
            </p>
          </div>
        </motion.div>
      </div>

    </div>
  )
}

export default AboutPage
