'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiDatabase, FiCheckCircle, FiActivity, FiServer, FiZap } from 'react-icons/fi'

const caseStudiesData = [
  {
    id: 'retail-multi-branch',
    tabTitle: 'Multi-Branch E-Commerce',
    tag: 'Enterprise Retail & Logistics',
    title: 'Architecting real-time inventory sync across 14 global retail branches',
    problem: 'The client faced severe database race conditions where identical items were sold simultaneously online and in physical stores. Their legacy system updated inventory on a 6-hour cron cycle, leading to high cancellation rates, dirty reads, and massive data desynchronisation across regional storefronts.',
    solution: 'We deployed a Next.js App Router gateway coupled with a robust PostgreSQL database leveraging row-level security (RLS) and conditional branch isolation rules. Real-time telemetry was handled via low-overhead WebSockets, streaming instant item deductions across all point-of-sale instances globally without causing server thread pool starvation.',
    metrics: [
      { label: 'Sync Latency', value: '<85ms', detail: 'Down from 6 hours' },
      { label: 'Query Speed', value: '140ms', detail: 'Complex multi-tenant indexing' },
      { label: 'Data Pollution', value: '0.00%', detail: 'Full ACID compliance' },
    ],
    techStack: ['Next.js', 'PostgreSQL', 'WebSockets', 'Redis'],
  },
  {
    id: 'saas-cloud-automation',
    tabTitle: 'Enterprise SaaS Platform',
    tag: 'B2B FinTech Operations',
    title: 'Scaling a multi-tenant dashboard to handle complex workspace permission roles',
    problem: 'A rapidly growing financial SaaS application was experiencing massive security vulnerabilities and sluggish dashboard load times. Their monolithic API could not scale securely when large corporate clients added hundreds of sub-accounts with highly custom, dynamic database permission rules.',
    solution: 'We re-engineered the backend into a decoupled Node.js and Express microservices structure. Using a hybrid database approach — PostgreSQL for relational financial transactions and Redis for high-speed session tokens — we implemented a bulletproof RBAC layer that securely signs and handles workspace data permissions on every request.',
    metrics: [
      { label: 'Dashboard Load', value: '0.4s', detail: 'Improved by 300%' },
      { label: 'Auth Verification', value: '12ms', detail: 'Ultra-fast Redis lookups' },
      { label: 'Security Breaches', value: 'Zero', detail: 'Third-party audited' },
    ],
    techStack: ['Node.js', 'Express.js', 'PostgreSQL', 'Redis', 'Next.js'],
  },
]

export default function CaseStudies() {
  const [activeTab, setActiveTab] = useState(caseStudiesData[0].id)
  const activeData = caseStudiesData.find(item => item.id === activeTab)

  return (
    <section className="w-full py-20 px-4 rounded-[2.5rem] shadow-xl shadow-slate-100 my-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500 font-poppins block mb-3">
            System Blueprints
          </span>
          <h2 className="font-poppins text-3xl sm:text-4xl font-semibold text-slate-900 leading-tight mb-4">
            Engineering solutions for{' '}
            <span className="gradient-text">complex system problems</span>
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-xl font-poppins">
            An open look at the code architecture, bottlenecks, and raw telemetry data behind our latest production deployments.
          </p>
        </motion.div>

        {/* Tab switcher */}
        <div className="flex gap-2 mb-10 flex-wrap">
          {caseStudiesData.map(study => (
            <button
              key={study.id}
              onClick={() => setActiveTab(study.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold font-poppins transition-all duration-200 ${
                activeTab === study.id
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-200'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50'
              }`}
            >
              {study.tabTitle}
            </button>
          ))}
        </div>

        {/* Main content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
          >
            {/* Left/middle: problem + solution */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <span className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase font-poppins block mb-2">
                  {activeData.tag}
                </span>
                <h3 className="font-poppins text-2xl sm:text-3xl font-semibold text-slate-900 leading-snug">
                  {activeData.title}
                </h3>
              </div>

              {/* Problem */}
              <div className="glass rounded-2xl p-5 border-l-4 border-red-400 shadow-sm">
                <div className="flex items-center gap-2 text-red-500 font-semibold text-xs uppercase tracking-wider font-poppins mb-3">
                  <FiServer className="w-3.5 h-3.5" />
                  <span>The Architectural Bottleneck</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{activeData.problem}</p>
              </div>

              {/* Solution */}
              <div className="glass rounded-2xl p-5 border-l-4 border-sky-400 shadow-sm">
                <div className="flex items-center gap-2 text-sky-600 font-semibold text-xs uppercase tracking-wider font-poppins mb-3">
                  <FiDatabase className="w-3.5 h-3.5" />
                  <span>The Deployed Architecture</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{activeData.solution}</p>
              </div>

              {/* Tech tags */}
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 font-poppins block mb-2">
                  Infrastructure Stack
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeData.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="bg-slate-900 text-slate-300 px-3 py-1 rounded-lg text-xs font-mono hover:bg-sky-600 hover:text-white transition-colors cursor-default"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: metrics */}
            <div className="glass rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-2 text-sky-500 font-semibold text-xs uppercase tracking-widest font-poppins">
                <FiActivity className="w-4 h-4" />
                <span>Performance Audit</span>
              </div>

              {activeData.metrics.map((metric, i) => (
                <div key={i} className={`${i !== activeData.metrics.length - 1 ? 'pb-5 border-b border-slate-100' : ''}`}>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 font-poppins block mb-1">
                    {metric.label}
                  </span>
                  <div className="text-3xl font-bold text-slate-900 font-poppins my-1 tracking-tight">
                    {metric.value}
                  </div>
                  <span className="text-xs text-sky-600 font-medium">{metric.detail}</span>
                </div>
              ))}

              <div className="flex gap-2 items-start pt-2 border-t border-slate-100">
                <FiCheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-sky-400" />
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every value verified through automated production deployment logs.
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  )
}