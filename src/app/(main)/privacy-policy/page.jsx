import React from 'react'

const LegalPage = ({ title }) => {
  return (
    <div className="max-w-4xl mx-auto py-24 px-6">
      <h1 className="text-4xl font-bold mb-10 tracking-tight text-slate-900">{title}</h1>
      <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4 uppercase tracking-widest text-[10px]">Overview</h2>
          <p>This document outlines our commitment to transparency, security, and the professional standards we maintain at Disibin.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4 uppercase tracking-widest text-[10px]">Details</h2>
          <p>We are currently updating our official documentation to reflect our latest operational protocols. For urgent inquiries regarding this policy, please contact our legal desk.</p>
        </section>
      </div>
    </div>
  )
}

const PrivacyPolicy = () => <LegalPage title="Privacy Policy" />
export default PrivacyPolicy
