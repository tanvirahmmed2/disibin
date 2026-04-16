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
  subtitle = "High-performance software solutions tailored for modern business architecture.",
  services = [],
  showSections = true,
  customSections = []
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pinning or scroll-reveal for the header
      gsap.from(".details-headline", {
        scrollTrigger: {
          trigger: ".details-headline",
          start: "top 90%",
          toggleActions: "play none none reverse"
        },
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out"
      });

      // Simple staggered cards
      gsap.from(".simple-service-card", {
        scrollTrigger: {
          trigger: ".services-grid-wrapper",
          start: "top 80%",
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out"
      });

      // Background transition on scroll
      gsap.to(".details-bg-overlay", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "bottom center",
          scrub: true
        },
        opacity: 1
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className='relative w-full py-32 bg-white overflow-hidden'>
      {/* Background Overlay for scroll effect */}
      <div className='details-bg-overlay absolute inset-0 bg-slate-50/50 opacity-0 transition-opacity -z-10' />
      
      <div className='container-custom'>
        {/* Header */}
        <div className="details-headline flex flex-col items-center text-center mb-24">
          <span className='text-emerald-600 font-black tracking-[0.4em] uppercase text-[10px] mb-6'>Capabilities</span>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter">
            {title}
          </h2>
          <p className="text-slate-500 max-w-2xl font-medium leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Services Grid */}
        <div className="services-grid-wrapper grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32">
          {services.map((service, index) => (
            <div
              key={service.id || index}
              className="simple-service-card p-12 bg-white border border-slate-100 rounded-[2.5rem] hover:border-emerald-500/30 transition-all duration-700 group cursor-default"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center text-2xl mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                {service.icon}
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">
                {service.title}
              </h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Custom Full-Width Service Sections */}
        {showSections && customSections.length > 0 && (
          <div className="space-y-40">
            {customSections.map((service, idx) => (
              <div key={service.id || idx} className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                <div className={`space-y-10 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <div className='space-y-4'>
                        <span className='text-emerald-500 font-bold tracking-widest uppercase text-[10px]'>Exploration 0{idx + 1}</span>
                        <h3 className="text-5xl font-black text-slate-900 tracking-tighter leading-tight">{service.title}</h3>
                    </div>
                  <div className="grid grid-cols-1 gap-4">
                    {service.sections?.map((section) => (
                      <div key={section.id} className="group p-8 bg-white border border-slate-50 rounded-3xl hover:border-emerald-500/20 transition-all">
                        <h4 className="font-black text-slate-800 mb-2 tracking-tight group-hover:text-emerald-700 transition-colors uppercase text-xs">{section.title}</h4>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">{section.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className={`relative aspect-[5/4] rounded-[3rem] overflow-hidden bg-slate-100 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-1000 grayscale hover:grayscale-0 hover:scale-105"
                  />
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
