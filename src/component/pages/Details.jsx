'use client'
import Image from 'next/image'
import React, { useContext } from 'react'
import { motion } from 'framer-motion'
import { Context } from '../helper/Context'

const Details = () => {
  const { services, customServices } = useContext(Context)
  return (
    <section className='w-full py-24 bg-white'>
      <div className='max-w-352 mx-auto px-6'>
        <div className="mb-20">
          <span className='text-emerald-500 font-bold tracking-widest uppercase text-[11px] mb-3 block'>
            What We Do
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Our Core Services
          </h2>
          <p className="text-slate-500 max-w-2xl text-lg leading-relaxed">
            High-performance software solutions tailored for modern business architecture.
          </p>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {services.map((service, index) => (
            <motion.div initial={{opacity:0}} whileInView={{opacity:1}} transition={{duration:2}}
              key={service.id || index}
              className="p-2 bg-emerald-500  ease-in-out border border-slate-100 rounded-xl hover:bg-white hover:shadow-md transition-all duration-500 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 text-slate-400 flex items-center justify-center text-2xl mb-8 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 transition-all duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-white group-hover:text-slate-900 mb-4 tracking-tight transition duration-500 ease-in-out">
                {service.title}
              </h3>
              <p className="text-white group-hover:text-slate-500 transition duration-500 ease-in-out text-sm font-medium leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>


        {customServices && customServices.length > 0 && (
          <div className="space-y-20">
            {customServices.map((section) => (
              <div key={section.id} className='w-full gap-10 flex flex-col md:flex-row items-center justify-cente md:items-start md:even:flex-row-reverse'>
                <motion.div initial={{opacity:0}} whileInView={{opacity:1}} transition={{duration:1}} className='w-full'>
                  <Image src={section.image} alt={section.title} width={1000} height={1000} className='w-full aspect-3/2 object-cover rounded-2xl'/>
                </motion.div>
                <div className='w-full flex flex-col gap-2'>
                  <h1 className=' text-xl font-semibold'>{section.title}</h1>
                  <p>{section.description}</p>


                </div>
              </div>

            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Details
