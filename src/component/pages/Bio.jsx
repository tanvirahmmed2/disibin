'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { FaRegStar } from 'react-icons/fa'

const Bio = () => {
    return (
        <div className='w-full  flex  items-center justify-center p-4 py-8'>
            <div className='w-full  flex flex-col items-center justify-center gap-6'>
                <div className='w-full flex flex-col gap-2 items-start justify-center'>
                    <h1 className='font-semibold text-3xl'>A great studio with high care</h1>
                    <p>We’re a tight-knit team focused on clarity, speed, and friendly collaboration. No fluff—just websites that work hard for your business.</p>

                </div>

                <div className='w-full text-center grid grid-cols-2 md:grid-cols-4 gap-2'>
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className='w-full flex flex-col items-center justify-center  border border-teal-500/40 h-37.5 rounded-lg text-xl font-semibold cursor-pointer hover:-mt-2 ease-in-out duration-300 hover:shadow-xl transform shadow shadow-teal-900'>
                        <p>150+</p>
                        <p>Projects Shipped</p>
                    </motion.div>
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className='w-full flex flex-col items-center justify-center  border border-teal-500/40 h-37.5 rounded-lg text-xl font-semibold cursor-pointer hover:-mt-2 ease-in-out duration-300 hover:shadow-xl transform shadow shadow-teal-900'>
                        <p>100+</p>
                        <p>Happy Clients</p>
                    </motion.div>
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className='w-full flex flex-col items-center justify-center  border border-teal-500/40 h-37.5 rounded-lg text-xl font-semibold cursor-pointer hover:-mt-2 ease-in-out duration-300 hover:shadow-xl transform shadow shadow-teal-900'>
                        <p className='flex items-center gap-1 text-teal-500'>5 <FaRegStar /></p>
                        <p>Customers Rated</p>
                    </motion.div>
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className='w-full flex flex-col items-center justify-center  border border-teal-500/40 h-37.5 rounded-lg text-xl font-semibold cursor-pointer hover:-mt-2 ease-in-out duration-300 hover:shadow-xl transform shadow shadow-teal-900'>
                        <p>10+</p>
                        <p>Senior Experts</p>
                    </motion.div>
                    

                </div>
            </div>
        </div>
    )
}

export default Bio
