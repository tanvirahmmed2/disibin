'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import React from 'react'

const ContactRedirect = () => {
    return (
        <div className='w-full flex flex-col items-center justify-center gap-4 text-center p-4'>
            <motion.div  initial={{opacity:0, y:50}} whileInView={{opacity:1, y:0}} transition={{duration:0.6}} className='w-full mx-auto gap-4 bg-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center'>
                <p className='text-4xl md:text-7xl bg-linear-to-br from-white p-4 font-poppins to-slate-300 bg-clip-text text-transparent'>Ready to build something great?</p>
                <p className='text-white text-xl'>Tell us about your plan & we&apos;ll get back very soon!</p>
                <Link href={'/contact'} className='bg-slate-100 px-6 p-2 rounded-2xl cursor-pointer font-poppins hover:bg-slate-300 transition duration-700 ease-in-out'>Get in touch</Link>
            </motion.div>
        </div>
    )
}

export default ContactRedirect
