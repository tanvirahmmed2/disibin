import React from 'react'

const LegalPage = ({ title }) => {
  return (
    <div className="max-w-4xl mx-auto py-24 px-6">
      <h1 className="text-4xl font-bold mb-10 tracking-tight text-slate-900">{title}</h1>
      <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4 uppercase tracking-widest text-[10px]">Policy</h2>
          <p>Our refund protocols are designed to be fair and transparent, respecting the bespoke nature of our high-performance digital solutions.</p>
        </section>
      </div>
    </div>
  )
}

const RefundPolicy = () => <LegalPage title="Refund Policy" />
export default RefundPolicy
