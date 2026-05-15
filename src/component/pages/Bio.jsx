'use client'
import React, { useEffect, useState } from 'react'

const Bio = () => {
  const [stats, setStats] = useState([
    { value: '120+', label: 'Businesses Served', desc: 'across industries worldwide' },
    { value: '50+', label: 'International Brands', desc: 'trusting our solutions' },
    { value: '6+', label: 'Years of Excellence', desc: 'delivering premium results' },
  ])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/public/home')
        const result = await response.json()
        if (result.success) {
          const { stats: fetchedStats } = result.data
          setStats([
            { value: `${fetchedStats.businesses}+`, label: 'Businesses Served', desc: 'across industries worldwide' },
            { value: `${fetchedStats.projects}+`, label: 'International Brands', desc: 'trusting our solutions' },
            { value: `${fetchedStats.years}+`, label: 'Years of Excellence', desc: 'delivering premium results' },
          ])
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      }
    }
    fetchStats()
  }, [])

  return (
    <section className='w-full flex flex-col items-center justify-center gap-12 py-16'>

      <div className='w-full flex flex-col gap-3 animate-fade-up'>
        <span className='text-xs font-semibold uppercase tracking-[0.3em] text-sky-500 font-poppins'>
          Our Impact
        </span>
        <h2 className='font-poppins text-3xl sm:text-5xl font-semibold text-slate-900 leading-tight max-w-2xl'>
          A High-Care Studio Built On{' '}
          <span className='gradient-text'>Clarity &amp; Impact</span>
        </h2>
      </div>

      <div className='w-full grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 font-poppins'>
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`
              group relative w-full p-8 rounded-2xl
              glass shadow-sm hover:shadow-xl hover:shadow-sky-100/60
              transition-all duration-500 cursor-default
              animate-count-up delay-${(i + 1) * 100}
              overflow-hidden
            `}
          >
            
            <div
              aria-hidden='true'
              className='pointer-events-none absolute -top-10 -left-10 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700'
              style={{
                background: 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)',
              }}
            />

            <p className='text-5xl sm:text-6xl font-semibold text-slate-900 group-hover:text-sky-600 transition-colors duration-300 mb-2'>
              {s.value}
            </p>
            <p className='text-sm font-semibold text-slate-700 mb-1'>{s.label}</p>
            <p className='text-xs text-slate-400'>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Bio