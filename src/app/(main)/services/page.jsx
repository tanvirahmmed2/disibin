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
    <div className='w-full min-h-screen bg-slate-50/50 pt-20 pb-20 relative overflow-hidden'>
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]"></div>
      </div>
      
      <div className="container-custom text-center mb-12 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-emerald-600 font-bold text-sm tracking-widest uppercase mb-4 block">Our Expertise</span>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight mb-4 leading-tight">
            Premium Digital <span className="text-emerald-500">Solutions</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            We build high-performance software systems tailored to your business needs, leveraging cutting-edge technology and modern architecture.
          </p>
          <div className="w-20 h-1 bg-linear-to-r from-emerald-500 to-emerald-400 rounded-full mx-auto mt-8"></div>
        </motion.div>
      </div>

      <div className="container-custom flex flex-col gap-16">
        {customServices.map((service, idx) => (
          <motion.div 
            key={service.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: idx * 0.1 }}
            className={`flex flex-col ${idx % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}
          >
            {/* Content Side */}
            <div className="flex-1 space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold text-xs">
                      0{idx + 1}
                    </span>
                    <div className="h-px flex-1 bg-slate-200"></div>
                  </div>
                  <h2 className='text-3xl md:text-4xl font-bold text-slate-900 leading-tight'>{service.title}</h2>
                </div>
                
                <p className="text-slate-500 text-base font-medium leading-relaxed">
                  {service.description.split('. ')[0]}. {service.description.split('. ')[1]}.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                    {service.features.slice(0, 4).map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                          <RiArrowRightLine size={10} className="text-emerald-600" />
                        </div>
                        <span className="text-xs font-bold text-slate-700">{feature}</span>
                    </div>
                    ))}
                </div>

                <div className="pt-2">
                  <Link href={`/services/${service.id}`} className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all duration-300 group shadow-lg shadow-slate-900/10 hover:shadow-emerald-500/20 text-sm">
                      Explore Service
                      <RiArrowRightLine className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
            </div>

            {/* Image Side */}
            <div className="flex-1 w-full">
                <div className="relative aspect-video lg:aspect-4/3 rounded-[2rem] overflow-hidden group shadow-xl shadow-slate-200">
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                    <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover transform group-hover:scale-105 transition-transform duration-1000"
                    />
                </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="container-custom mt-20">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="relative z-10 space-y-6">
            <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight">Ready to start your project?</h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto font-medium">
              Consult with our experts today and discover how we can transform your business with technology.
            </p>
            <Link href="/contact" className="inline-flex px-8 py-4 bg-emerald-500 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 text-sm">
              Get Started Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServicesPage

