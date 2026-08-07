import React from 'react'
import Link from 'next/link'

const Intro = () => {
  return (
    <section className='w-full relative flex flex-col gap-12 items-start justify-center py-28 min-h-200 px-2 overflow-hidden'>



      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundColor: 'transparent',
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      <div className="relative z-10 w-full flex flex-col gap-12">
        <div className='w-full flex flex-col gap-4 animate-fade-up delay-100'>
          <p className='font-poppins text-lg sm:text-xl tracking-wide'>
            We build technology
          </p>
          <h1 className='font-poppins text-5xl sm:text-7xl lg:text-8xl font-semibold leading-[1.08] tracking-tight text-slate-900'>
            that{' '}
            <span className='gradient-text'>works,</span>
            <br />
            scales, and{' '}
            <span className='gradient-text'>performs</span>
          </h1>
        </div>

        <div className='w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8 animate-fade-up delay-300'>
          <p className='max-w-md font-poppins text-sm sm:text-base text-slate-500 leading-relaxed'>
            From concept to premium digital solutions — crafting fast, scalable web
            applications that seamlessly combine design, development, and automation
            into one powerful ecosystem. Long-term partnerships, continuous growth.
          </p>

          <div className='flex flex-row items-center gap-3 shrink-0'>
            <Link
              href='/contact'
              className='px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all duration-300 animate-pulse-glow shadow-md shadow-primary/20'
            >
              Get Started
            </Link>
            <Link
              href='/products'
              className='px-6 py-3 rounded-xl border border-primary/30 text-primary text-sm font-semibold hover:border-primary hover:bg-primary/10 transition-all duration-300'
            >
              View Work →
            </Link>
          </div>
        </div>
      </div>

    </section>
  )
}

export default Intro