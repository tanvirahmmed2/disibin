import PackageCard from '@/component/card/PackageCard'
import { BASE_URL } from '@/lib/database/secret'
import React from 'react'

const packagesPage = async () => {
  const res = await fetch(`${BASE_URL}/api/package`, {
    method: 'GET',
    cache: 'no-store'
  })

  const data = await res.json()

  if (!data.success) return (
    <div className='w-full min-h-[60vh] flex items-center justify-center bg-slate-50'>
      <div className="card-premium p-12 text-center text-slate-500 font-medium">
        Failed to load packages.
      </div>
    </div>
  )
  const packages = data.payload || []

    return (
    <main className='w-full min-h-screen bg-white pt-20'>
      <section className='py-6 border-b border-slate-50'>
        <div className="container-custom">
            <div className="max-w-3xl">
                <span className='px-4 py-1.5 bg-emerald-500/5 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] rounded-full inline-block mb-6'>Solutions</span>
                <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none mb-8">Service Plans<span className='text-emerald-500/50'>.</span></h1>
                <p className="text-xl text-slate-500 font-medium leading-relaxed">Strategic pricing models designed for scalability and long-term technical excellence.</p>
            </div>
        </div>
      </section>

      <section className='py-6 bg-slate-50/30'>
        <div className='container-custom'>
            {packages.length === 0 ? (
            <div className="p-24 text-center border-2 border-dashed border-slate-200 rounded-[3rem]">
                <h3 className="text-2xl font-black text-slate-900 mb-2">No Packages Found</h3>
                <p className="text-slate-500 font-medium">We are currently updating our offerings. Check back soon!</p>
            </div>
            ) : (
            <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {packages.map((pack) => (
                <PackageCard key={pack._id} pack={pack}/>
                ))}
            </div>
            )}
        </div>
      </section>
    </main>
    )
}


export default packagesPage

