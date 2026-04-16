'use client'
import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Details = ({ 
  title = "Our Core Services", 
  subtitle = "High-performance solutions tailored to your business needs.",
  services = [],
  showSections = true,
  customSections = []
}) => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.from(".details-header", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".details-header",
          start: "top 80%",
        }
      });

      // Cards Staggered Animation
      gsap.from(".service-card", {
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".services-grid",
          start: "top 75%",
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className='w-full py-20 bg-slate-50/50 overflow-hidden'>
      <div className='container-custom'>
        {/* Header */}
        <div className="details-header flex flex-col items-center text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {title}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mb-8 font-medium">
            {subtitle}
          </p>
          <div className="w-24 h-1.5 bg-emerald-500 rounded-full shadow-lg shadow-emerald-200"></div>
        </div>

        {/* Services Grid */}
        <div className="services-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {services.map((service, index) => (
            <div
              key={service.id || index}
              className="service-card group relative bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-premium hover:shadow-premium-hover transition-all duration-500 cursor-pointer overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-2 h-0 group-hover:h-full bg-emerald-500 transition-all duration-500" />
              
              <div className="relative z-10 text-4xl mb-6 text-emerald-600 p-4 bg-emerald-50 w-fit rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 transform group-hover:rotate-6">
                {service.icon}
              </div>

              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-emerald-700 transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-500 leading-relaxed mb-6 group-hover:text-slate-600 transition-colors">
                  {service.description}
                </p>
                <div className="flex items-center text-emerald-600 font-bold group-hover:gap-2 transition-all">
                  <span>Learn more</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Sections (Dynamic) */}
        {showSections && customSections.length > 0 && (
          <div className="space-y-32">
            {customSections.map((service, idx) => (
              <div key={service.id || idx} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className={`space-y-8 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <h3 className="text-4xl font-black text-slate-900">{service.title}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {service.sections?.map((section) => (
                      <div key={section.id} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-emerald-200 transition-colors">
                        <h4 className="font-bold text-slate-800 mb-2">{section.title}</h4>
                        <p className="text-sm text-slate-500 line-clamp-3">{section.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className={`relative aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transform hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/20 to-transparent pointer-events-none"></div>
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

