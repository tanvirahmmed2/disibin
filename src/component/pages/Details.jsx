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
      
      gsap.from(".details-headline > *", {
        scrollTrigger: {
          trigger: ".details-headline",
          start: "top 85%",
          toggleActions: "play none none reverse"
        },
        y: 60,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "power4.out"
      });

      
      gsap.from(".simple-service-card", {
        scrollTrigger: {
          trigger: ".services-grid-wrapper",
          start: "top 75%",
        },
        y: 80,
        opacity: 0,
        rotationX: -10,
        transformOrigin: "center top",
        duration: 1,
        stagger: 0.1,
        ease: "back.out(1.2)"
      });

      
      gsap.utils.toArray(".parallax-image").forEach((img) => {
        gsap.to(img, {
          scrollTrigger: {
            trigger: img,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5
          },
          y: -50,
          ease: "none"
        });
      });

      
      gsap.from(".section-content", {
        scrollTrigger: {
          trigger: ".section-content",
          start: "top 80%",
        },
        x: -50,
        opacity: 0,
        duration: 1.2,
        stagger: 0.3,
        ease: "power3.out"
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className='relative w-full py-40 bg-white overflow-hidden'>
      <div className='absolute top-0 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-slate-100 to-transparent' />
      
      <div className='container-custom'>
        {/* Headline */}
        <div className="details-headline flex flex-col items-center text-center mb-32">
          <span className='text-primary font-black tracking-[0.5em] uppercase text-[10px] mb-8 bg-primary/5 px-4 py-2 rounded-lg'>Capabilities</span>
          <h2 className="text-5xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-none uppercase">
            {title}
          </h2>
          <div className="w-24 h-1 bg-primary mb-8" />
          <p className="text-slate-500 max-w-2xl font-medium leading-relaxed text-lg">
            {subtitle}
          </p>
        </div>

        {/* Services Grid */}
        <div className="services-grid-wrapper grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-48">
          {services.map((service, index) => (
            <div
              key={service.id || index}
              className="simple-service-card p-14 bg-white border border-slate-100 rounded-[3rem] hover:border-primary/20 transition-all duration-700 group cursor-default shadow-sm hover:shadow-premium"
            >
              <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 text-slate-400 flex items-center justify-center text-3xl mb-10 group-hover:bg-primary group-hover:text-white group-hover:rotate-[10deg] transition-all duration-500">
                {service.icon}
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-6 tracking-tight uppercase">
                {service.title}
              </h3>
              <p className="text-slate-500 text-base font-medium leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Custom Sections */}
        {showSections && customSections.length > 0 && (
          <div className="space-y-60">
            {customSections.map((service, idx) => (
              <div key={service.id || idx} className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                <div className={`space-y-12 section-content ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <div className='space-y-6'>
                        <span className='text-primary font-black tracking-widest uppercase text-[10px] bg-primary/5 px-3 py-1.5 rounded-md'>Phase 0{idx + 1}</span>
                        <h3 className="text-6xl font-black text-slate-900 tracking-tighter leading-[0.9] uppercase">{service.title}</h3>
                    </div>
                  <div className="grid grid-cols-1 gap-6">
                    {service.sections?.map((section) => (
                      <div key={section.id} className="group p-10 bg-white border border-slate-100 rounded-[2.5rem] hover:border-primary/20 transition-all duration-500 shadow-sm hover:shadow-premium">
                        <h4 className="font-black text-slate-800 mb-4 tracking-widest group-hover:text-primary transition-colors uppercase text-xs">{section.title}</h4>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">{section.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className={`relative aspect-[4/5] rounded-[4rem] overflow-hidden bg-slate-100 shadow-2xl ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="parallax-image object-cover scale-110"
                  />
                  <div className="absolute inset-0 bg-primary/10 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity" />
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
