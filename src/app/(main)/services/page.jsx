import React from 'react'

const ServicesPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-20 px-4 text-center">
      <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-sky-400 to-indigo-600 bg-clip-text text-transparent tracking-tighter">
        Our Services
      </h1>
      <p className="text-slate-500 max-w-2xl text-lg leading-relaxed">
        We architect high-performance digital ecosystems, from custom enterprise software to immersive consumer experiences.
      </p>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {/* Placeholders for service cards */}
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 text-left group">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center mb-6 group-hover:bg-sky-500 group-hover:text-white transition-all duration-500">
                <span className="font-bold text-xl">{i}</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Innovation {i}</h3>
            <p className="text-slate-500 text-sm">Strategic implementation of modern technologies to drive your business forward.</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ServicesPage
