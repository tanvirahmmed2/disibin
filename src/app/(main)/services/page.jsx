'use client'
import Image from 'next/image'
import React, { useContext } from 'react'
import { motion } from 'framer-motion'
import { Context } from '@/component/helper/Context'
import Link from 'next/link'
import { RiArrowRightLine } from 'react-icons/ri'

const ServicesPage = () => {
    const { customServices } = useContext(Context)
    
  return (
    <div className='w-full min-h-screen bg-slate-50 pt-20 pb-20'>
      {/* Header */}
      <div className="container-custom text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Our Services</h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">Discover our comprehensive suite of digital solutions designed to elevate your business.</p>
        <div className="w-24 h-1.5 bg-emerald-500 rounded-full mx-auto mt-8 shadow-lg shadow-emerald-200"></div>
      </div>

      <div className="container-custom flex flex-col gap-24">
        {customServices.map((service, idx) => (
          <div key={service.id} className="relative bg-white rounded-[3rem] p-8 md:p-12 shadow-premium hover:shadow-premium-hover transition-all duration-500 overflow-hidden group">
            
            <div className="flex flex-col lg:flex-row gap-12 relative z-10">
                {/* Left Content */}
                <div className="flex-1 flex flex-col justify-center">
                    <h2 className='text-3xl md:text-4xl font-black text-slate-800 mb-6 group-hover:text-emerald-700 transition-colors'>{service.title}</h2>
                    <p className="text-slate-500 text-lg mb-8">We deliver high-quality {service.title.toLowerCase()} tailored to your specific requirements, ensuring cutting-edge technology and best practices.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        {service.sections.slice(0, 4).map((section) => (
                        <div key={section.id} className="flex items-start gap-3">
                            <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 shadow-sm shadow-emerald-300"></div>
                            <span className="text-sm font-bold text-slate-700">{section.title}</span>
                        </div>
                        ))}
                    </div>

                    <Link href={`/services/${encodeURIComponent(service.title.toLowerCase().replace(/ /g, '-'))}`} className="btn-primary w-fit flex items-center gap-2 group/btn">
                        Explore {service.title}
                        <RiArrowRightLine className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Right Image */}
                <div className="flex-1">
                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 bg-emerald-600/10 mix-blend-multiply z-10 group-hover:bg-transparent transition-all duration-500"></div>
                        <Image
                            src={service.image}
                            alt={service.title}
                            fill
                            className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                </div>
            </div>

            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-50 to-teal-100 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 pointer-events-none"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ServicesPage

