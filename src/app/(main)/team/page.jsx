import React from 'react'

const TeamPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-20 px-4 text-center">
      <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-transparent tracking-tighter">
        Dedicated Team
      </h1>
      <p className="text-slate-500 max-w-2xl text-lg leading-relaxed mb-12">
        A collective of specialized architects, designers, and engineers committed to building the worldwide network.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
        {[1, 2, 3].map(i => (
          <div key={i} className="group">
            <div className="aspect-square rounded-3xl bg-slate-100 mb-6 overflow-hidden relative">
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <h3 className="text-xl font-bold">Studio Architect {i}</h3>
            <p className="text-sky-500 text-sm font-semibold uppercase tracking-widest mt-1">Specialist</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TeamPage
