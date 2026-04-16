import { BASE_URL } from '@/lib/database/secret'
import React from 'react'
import Link from 'next/link'
import { RiCheckLine, RiStarFill } from 'react-icons/ri'

export const metadata = {
  title: 'Premium Memberships | Disibin',
  description: 'Join our premium memberships to unlock exclusive access to the best digital services.',
}

const Memberships = async () => {
  // We'll stub out the API fetch. Assuming it returns an array of membership objects under payload.
  // We fallback to empty array if it fails so the empty state renders beautifully instead of crashing.
  let memberships = []
  try {
    const res = await fetch(`${BASE_URL}/api/package`, { method: 'GET', cache: 'no-store' })
    const data = await res.json()
    // Using packages as a placeholder if there is no explicit memberships endpoint yet, or stub it entirely.
    if (data.success && data.payload) {
       // Filter to just show highest tier packages or format them
       memberships = data.payload.slice(0, 3)
    }
  } catch (error) {
    console.error("Error fetching memberships", error)
  }

  return (
    <div className='w-full min-h-screen bg-slate-50 py-20'>
      <div className="container-custom">
        <div className="text-center mb-16">
          <span className="text-emerald-600 font-bold tracking-widest uppercase text-sm mb-2 block">Exclusive Access</span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Premium Memberships</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">Elevate your digital presence with our top-tier tailored solutions. Built for professionals who demand excellence.</p>
          <div className="w-24 h-1.5 bg-emerald-500 rounded-full mx-auto mt-8 shadow-lg shadow-emerald-200"></div>
        </div>

        {memberships.length === 0 ? (
          <div className="card-premium p-16 text-center max-w-3xl mx-auto border-2 border-emerald-100 bg-emerald-50/30">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
               <RiStarFill size={40} />
            </div>
            <h3 className="text-3xl font-black text-slate-800 mb-4">Coming Soon</h3>
            <p className="text-slate-600 text-lg mb-8">We are crafting the perfect premium membership plans for you. Please check back later to unlock exclusive access.</p>
            <Link href="/services" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 transition-all hover:-translate-y-1">
              Explore Our Services
            </Link>
          </div>
        ) : (
          <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto'>
            {memberships.map((plan, idx) => (
              <div 
                key={plan._id || idx} 
                className={`card-premium relative overflow-hidden flex flex-col ${idx === 1 ? 'border-2 border-emerald-500 shadow-2xl scale-105 z-10' : 'mt-4 md:mt-0'}`}
              >
                {idx === 1 && (
                  <div className="absolute top-0 inset-x-0 w-full bg-emerald-500 text-white text-xs font-bold text-center py-1.5 uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                
                <div className={`p-8 ${idx === 1 ? 'pt-10' : ''}`}>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">{plan.title}</h3>
                  <p className="text-slate-500 text-sm mb-6 h-10 line-clamp-2">{plan.description}</p>
                  
                  <div className="flex items-end gap-1 mb-6">
                    <span className="text-4xl font-black text-slate-900">${plan.price || '199'}</span>
                    <span className="text-slate-500 font-medium mb-1">/month</span>
                  </div>

                  <Link 
                    href={idx === 1 ? '/register' : '/contact'} 
                    className={`block w-full py-4 rounded-xl text-center font-bold transition-all ${
                      idx === 1 
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/30' 
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    Get Started
                  </Link>
                </div>
                
                <div className="p-8 pt-0 flex-1 flex flex-col gap-4 border-t border-slate-100 bg-slate-50">
                   {['Full access to core tools', 'Priority 24/7 support', 'Advanced analytics dashboard', 'Custom onboarding session'].map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="mt-1 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-600">
                          <RiCheckLine size={14} />
                        </div>
                        <span className="text-slate-600 text-sm font-medium">{feature}</span>
                      </div>
                   ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Memberships
