import OfferCard from '@/component/card/OfferCard'
import { BASE_URL } from '@/lib/database/secret'
import React from 'react'
import { RiFlashlightLine, RiArrowRightLine } from 'react-icons/ri'

const OffersPage = async () => {
    let offers = [];
    try {
        const res = await fetch(`${BASE_URL}/api/coupon`, {
            method: 'GET',
            cache: 'no-store'
        })
        const data = await res.json()
        offers = data.data || []
    } catch (error) {
        console.error("Offers Fetch Error:", error);
    }

    return (
        <main className='w-full min-h-screen bg-slate-50 pt-24 pb-20'>
            <div className="container-custom">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-4">
                    <div className="max-w-2xl space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-500/10">
                            <RiFlashlightLine /> Exclusive Opportunities
                        </div>
                        <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">
                            Limited Time <span className="text-emerald-500">Offers.</span>
                        </h1>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed">
                            Strategic digital packages designed for rapid scaling. Secure your competitive advantage with our curated deal collection.
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                            Scroll to explore <RiArrowRightLine />
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="w-full px-4">
                    {offers.length === 0 ? (
                        <div className="p-20 text-center bg-white border border-slate-100 rounded-3xl shadow-sm">
                            <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-200">
                                <RiFlashlightLine size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">No Active Offers</h3>
                            <p className="text-slate-500 font-medium max-w-sm mx-auto">Our editors are currently finalizing new strategic deals. Check back shortly for updates.</p>
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                            {offers.map((offer) => (
                                <OfferCard key={offer.offer_id || offer.package_id} offer={offer}/>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}

export default OffersPage
