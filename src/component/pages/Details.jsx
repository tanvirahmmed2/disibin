'use client'
import Image from 'next/image'
import React, { useContext } from 'react'
import { Context } from '../helper/Context'

const Details = () => {
  const { services, customServices } = useContext(Context)
  return (
    <section className='w-full py-24 bg-white'>
      <div className='max-w-7xl mx-auto px-6'>
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


        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => (
            <div
              key={service.id || index}
              className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 text-slate-400 flex items-center justify-center text-2xl mb-8 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 transition-all duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4 tracking-tight">
                {service.title}
              </h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>


        {customServices && customServices.length > 0 && (
          <div className="space-y-20">
            {customServices.map((section) => (
              <div key={section.id} className='w-full flex flex-col items-center justify-center gap-6 group'>
                <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='flex flex-col gap-4'>
                    <h1 className='text-2xl font-bold'>{section.title}</h1>
                    <p className="text-slate-600 leading-relaxed">{section.description}</p>
                  </div>
                  <div className='overflow-hidden rounded-2xl aspect-video'>
                    <Image src={section.image} alt='service image' width={1000} height={1000} className='aspect-video rounded-2xl group-hover:scale-110 transition duration-700 ease-in-out scale-100 overflow-hidden'/>
                  </div>
                </div>
                <div className='w-full grid grid-cols-2 md:grid-cols-3 gap-4'>
                  {section.sections?.map((subSection) => (
                      <div key={subSection.id} className="p-6 bg-white hover:bg-slate-50 transition duration-300 ease-in-out border border-slate-100 rounded-xl">
                        <h4 className="font-semibold text-slate-800 mb-2 text-sm uppercase tracking-wide">
                          {subSection.title}
                        </h4>
                        <p className="text-sm text-slate-500 leading-relaxed">
                          {subSection.description}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
              // <div key={section.id || idx} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              //   <div className={`space-y-8 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>

              //     <div>
              //       <div className='space-y-4'>
              //         <span className='text-emerald-500 font-bold tracking-widest uppercase text-[10px] bg-emerald-500/5 px-3 py-1 rounded-full'>
              //           Phase {idx + 1}
              //         </span>
              //         <h3 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              //           {section.title}
              //         </h3>
              //         <p>{section.description}</p>
              //       </div>
              //       <div className={`relative aspect-video rounded-3xl overflow-hidden bg-slate-100 shadow-sm ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
              //         {section.image && (
              //           <Image
              //             width={1000}
              //             height={1000}
              //             src={section.image}
              //             alt={section.title}
              //             className="w-full h-full object-cover"
              //           />
              //         )}
              //       </div>
              //     </div>
              //     <div className="space-y-4">
              //       {section.sections?.map((subSection) => (
              //         <div key={subSection.id} className="p-6 bg-white border border-slate-100 rounded-2xl">
              //           <h4 className="font-bold text-slate-800 mb-2 text-sm uppercase tracking-wide">
              //             {subSection.title}
              //           </h4>
              //           <p className="text-sm text-slate-500 leading-relaxed">
              //             {subSection.description}
              //           </p>
              //         </div>
              //       ))}
              //     </div>
              //   </div>


              // </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Details
