import { BASE_URL } from '@/lib/database/secret'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { RiCheckLine, RiShieldFlashLine, RiArrowLeftLine } from 'react-icons/ri'

const Membership = async ({ params }) => {
  const { slug } = await params

  if (!slug) return <div className="min-h-screen flex items-center justify-center font-bold">No slug found</div>

  const res = await fetch(`${BASE_URL}/api/membership/${slug}`, {
    method: 'GET',
    cache: 'no-store'
  })

  const data = await res.json()

  if (!data.success || !data.payload) {
    return (
      <div className='w-full min-h-screen flex flex-col items-center justify-center gap-4'>
        <p className="text-2xl font-black text-slate-800">Plan Not Found</p>
        <Link href="/memberships" className="text-emerald-500 font-bold hover:underline">Back to Memberships</Link>
      </div>
    )
  }

  const membership = data.payload

  return (
    <div className='w-full min-h-screen bg-white py-24'>
      <div className="container-custom max-w-5xl mx-auto px-6">

        <Link href="/memberships" className="flex items-center gap-2 text-slate-400 hover:text-emerald-500 transition-colors mb-12 font-bold text-sm uppercase tracking-widest">
          <RiArrowLeftLine size={20} /> Back to Plans
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          <div className="space-y-8">
            <div className="relative group">
              <div className="absolute -inset-4 bg-emerald-500/5 rounded-[3rem] blur-2xl group-hover:bg-emerald-500/10 transition-all duration-500"></div>
              <Image
                src={membership.image}
                alt={membership.title}
                width={800}
                height={600}
                className="relative rounded-[2.5rem] object-cover w-full shadow-2xl border border-slate-50"
              />
            </div>

            <div className="p-8 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <RiShieldFlashLine size={24} />
                </div>
                <h4 className="font-black text-slate-900 uppercase tracking-tighter">Secure Activation</h4>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                All our premium memberships include instant access to core tools, priority support, and manual verification for your security.
              </p>
            </div>
          </div>
          <div className="space-y-10">
            <div className="space-y-4">
              <span className="text-emerald-500 font-black tracking-[0.2em] uppercase text-[10px] block">Membership Detail</span>
              <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">
                {membership.title}
              </h1>
              <p className="text-slate-500 text-lg font-medium leading-relaxed">
                {membership.description}
              </p>
            </div>

            <div className="flex items-baseline gap-2 border-y border-slate-50 py-8">
              <span className="text-5xl font-black text-slate-900">${membership.price}</span>
              <span className="text-slate-400 font-bold text-lg">/{membership.duration}</span>
              {membership.discount > 0 && (
                <span className="ml-4 bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full text-xs font-black uppercase">
                  Save ${membership.discount}
                </span>
              )}
            </div>

            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Included Features</h3>
              <div className="grid grid-cols-1 gap-4">
                {membership.features?.map((feature, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                      <RiCheckLine size={14} />
                    </div>
                    <span className="text-slate-700 font-bold text-sm tracking-tight">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

           
          </div>

        </div>
      </div>
    </div>
  )
}

export default Membership