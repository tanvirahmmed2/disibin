
import React from 'react'

const LegalPage = ({ title }) => {
  return (
    <div className="max-w-5xl mx-auto py-24 px-6 sm:px-10">

      {/* Header */}
      <div className="mb-16 border-b border-slate-100 pb-10">
        <p className="uppercase tracking-[0.3em] text-xs text-sky-600 font-semibold mb-4">
          Legal Documentation
        </p>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
          {title}
        </h1>

        <p className="mt-6 text-slate-600 text-lg leading-relaxed max-w-3xl">
          This document explains how Disibin collects, manages, protects,
          and processes information across our products, platforms,
          services, and digital infrastructure.
        </p>
      </div>

      {/* Content */}
      <div className="space-y-16 text-slate-600 leading-relaxed">

        {/* Section */}
        <section className="space-y-5">
          <div>
            <p className="uppercase tracking-[0.25em] text-[11px] text-sky-600 font-semibold mb-3">
              01 — Introduction
            </p>

            <h2 className="text-2xl font-semibold text-slate-900">
              Commitment to Transparency
            </h2>
          </div>

          <p>
            At Disibin, transparency, security, and responsible data
            management are fundamental principles that guide our operations.
            We are committed to protecting user information while maintaining
            the highest standards of digital integrity and professional ethics.
          </p>

          <p>
            By accessing our services, platforms, applications, or digital
            products, you acknowledge and agree to the collection and use
            of information in accordance with this policy.
          </p>
        </section>

        {/* Section */}
        <section className="space-y-5">
          <div>
            <p className="uppercase tracking-[0.25em] text-[11px] text-sky-600 font-semibold mb-3">
              02 — Information Collection
            </p>

            <h2 className="text-2xl font-semibold text-slate-900">
              Data We Collect
            </h2>
          </div>

          <p>
            We may collect personal, technical, and operational data to
            improve our services and maintain platform reliability.
            Information may include:
          </p>

          <ul className="list-disc pl-6 space-y-3">
            <li>Full name, email address, and contact information</li>
            <li>Billing and transaction information</li>
            <li>Authentication and account security data</li>
            <li>IP address, browser, and device information</li>
            <li>Usage analytics and interaction metrics</li>
            <li>Customer support communications</li>
          </ul>
        </section>

        {/* Section */}
        <section className="space-y-5">
          <div>
            <p className="uppercase tracking-[0.25em] text-[11px] text-sky-600 font-semibold mb-3">
              03 — Data Usage
            </p>

            <h2 className="text-2xl font-semibold text-slate-900">
              How Information Is Used
            </h2>
          </div>

          <p>
            Information collected through our ecosystem is used to operate,
            maintain, optimize, and secure our digital infrastructure.
          </p>

          <ul className="list-disc pl-6 space-y-3">
            <li>Providing and maintaining services</li>
            <li>Processing payments and transactions</li>
            <li>Enhancing user experience and platform performance</li>
            <li>Preventing fraud and unauthorized access</li>
            <li>Improving support and communication systems</li>
            <li>Meeting legal and regulatory obligations</li>
          </ul>
        </section>

        {/* Section */}
        <section className="space-y-5">
          <div>
            <p className="uppercase tracking-[0.25em] text-[11px] text-sky-600 font-semibold mb-3">
              04 — Security Standards
            </p>

            <h2 className="text-2xl font-semibold text-slate-900">
              Enterprise-Level Protection
            </h2>
          </div>

          <p>
            Disibin applies modern security practices designed to safeguard
            user data against unauthorized access, disclosure, or misuse.
          </p>

          <p>
            Our systems may include encrypted communications, access control
            policies, secure authentication mechanisms, infrastructure
            monitoring, and regular security reviews to maintain operational
            resilience.
          </p>
        </section>

        {/* Section */}
        <section className="space-y-5">
          <div>
            <p className="uppercase tracking-[0.25em] text-[11px] text-sky-600 font-semibold mb-3">
              05 — Third-Party Services
            </p>

            <h2 className="text-2xl font-semibold text-slate-900">
              External Integrations
            </h2>
          </div>

          <p>
            Certain services may rely on trusted third-party providers for
            payments, hosting, analytics, communication, or cloud
            infrastructure. These providers operate under their own privacy
            and security policies.
          </p>

          <p>
            We carefully evaluate external vendors to ensure professional
            operational standards and secure data handling practices.
          </p>
        </section>

        {/* Section */}
        <section className="space-y-5">
          <div>
            <p className="uppercase tracking-[0.25em] text-[11px] text-sky-600 font-semibold mb-3">
              06 — User Rights
            </p>

            <h2 className="text-2xl font-semibold text-slate-900">
              Access & Control
            </h2>
          </div>

          <p>
            Users may request access, correction, modification, or removal
            of personal information in accordance with applicable legal and
            regulatory frameworks.
          </p>

          <p>
            Requests related to account management, privacy concerns, or
            data handling may be submitted through our official support
            channels.
          </p>
        </section>

        {/* Section */}
        <section className="space-y-5">
          <div>
            <p className="uppercase tracking-[0.25em] text-[11px] text-sky-600 font-semibold mb-3">
              07 — Policy Updates
            </p>

            <h2 className="text-2xl font-semibold text-slate-900">
              Revisions & Amendments
            </h2>
          </div>

          <p>
            We reserve the right to update this Privacy Policy periodically
            to reflect operational, legal, technological, or regulatory
            changes.
          </p>

          <p>
            Continued use of our services following updates constitutes
            acceptance of the revised policy terms.
          </p>
        </section>

        {/* Footer */}
        <section className="pt-10 border-t border-slate-100">
          <p className="text-sm text-slate-500">
            Last updated: May 2026
          </p>
        </section>
      </div>
    </div>
  )
}

const PrivacyPolicy = () => <LegalPage title="Privacy Policy" />

export default PrivacyPolicy
