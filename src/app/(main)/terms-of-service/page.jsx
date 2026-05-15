import React from 'react'

const LegalPage = ({ title }) => {
  return (
    <div className="max-w-4xl mx-auto py-24 px-6">
      <h1 className="text-4xl font-bold mb-10 tracking-tight text-slate-900">{title}</h1>
      <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4 uppercase tracking-widest text-[10px]">Agreement</h2>
          <p>By accessing Disibin's platforms and services, you agree to comply with our professional standards and operational guidelines.</p>
        </section>
      </div>
    </div>
  )
}

const TermsOfService = () => <LegalPage title="Terms of Service" />
export default TermsOfService
