import OfferCard from '@/component/card/OfferCard'
import { BASE_URL } from '@/lib/database/secret'
import React from 'react'

const OffersPage = async () => {
  const res = await fetch(`${BASE_URL}/api/offers`, {
    method: 'GET',
    cache: 'no-store'
  })

  const data = await res.json()

  if (!data.success) return (
    <div className='w-full min-h-[60vh] flex items-center justify-center bg-slate-50'>
      <div className="card-premium p-12 text-center text-slate-500 font-medium">
        Failed to load offers.
      </div>
    </div>
  )
  const offers = data.payload

    return (
    <main className='w-full min-h-screen bg-white pt-20'>
      <section className='py-24 border-b border-slate-50'>
        <div className="container-custom">
            <div className="max-w-3xl">
                <span className='px-4 py-1.5 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.3em] rounded-full inline-block mb-6'>Flash Deals</span>
                <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none mb-8">Exclusive Offers<span className='text-primary'>.</span></h1>
                <p className="text-xl text-slate-500 font-medium leading-relaxed">Limited-time strategic opportunities designed to accelerate your digital growth.</p>
            </div>
        </div>
      </section>

      <section className='py-24 bg-slate-50/30'>
        <div className='container-custom'>
            {offers.length === 0 ? (
            <div className="p-24 text-center border-2 border-dashed border-slate-200 rounded-[3rem]">
                <h3 className="text-2xl font-black text-slate-900 mb-2">No Offers Found</h3>
                <p className="text-slate-500 font-medium">We are currently preparing new exclusive deals. Check back soon!</p>
            </div>
            ) : (
            <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
                {offers.map((offer) => (
                <OfferCard key={offer._id} offer={offer}/>
                ))}
            </div>
            )}
        </div>
      </section>
    </main>
    )
}

export default OffersPage
