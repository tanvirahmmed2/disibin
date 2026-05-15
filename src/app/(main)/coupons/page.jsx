import React from 'react'

const CouponsPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-20 px-4 text-center">
      <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-sky-500 bg-clip-text text-transparent">
        Exclusive Offers
      </h1>
      <p className="text-slate-500 max-w-md">
        Unlock premium value with our active promotional codes and studio partnerships.
      </p>
      <div className="mt-10 p-10 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
         <p className="text-slate-400 font-medium italic">No active coupons at this moment. Stay tuned.</p>
      </div>
    </div>
  )
}

export default CouponsPage
