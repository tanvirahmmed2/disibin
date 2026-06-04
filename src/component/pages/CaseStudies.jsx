'use client'
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDatabase, FiCheckCircle, FiActivity, FiServer } from 'react-icons/fi';

const caseStudiesData = [
  {
    id: 'retail-multi-branch',
    tabTitle: 'Multi-Branch E-Commerce',
    title: 'Architecting real-time inventory sync across 14 global retail branches',
    clientType: 'Enterprise Retail & Logistics',
    problem: 'The client faced severe database race conditions where identical items were sold simultaneously online and in physical stores. Their legacy system updated inventory on a 6-hour cron cycle, leading to high cancellation rates, dirty reads, and massive data desynchronization across regional storefronts.',
    solution: 'We deployed a Next.js App Router gateway coupled with a robust PostgreSQL database leveraging row-level security (RLS) and conditional branch isolation rules. Real-time telemetry was handled via low-overhead WebSockets, streaming instant item deductions across all point-of-sale instances globally without causing server thread pool starvation.',
    metrics: [
      { label: 'Sync Latency', value: '< 85ms', detail: 'Down from 6 hours' },
      { label: 'Query Performance', value: '140ms', detail: 'Complex multi-tenant indexing' },
      { label: 'Data Pollution', value: '0.00%', detail: 'Achieved complete ACID compliance' }
    ],
    techStack: ['Next.js', 'PostgreSQL', 'WebSockets', 'Redis Caching']
  },
  {
    id: 'saas-cloud-automation',
    tabTitle: 'Enterprise SaaS Platform',
    title: 'Scaling a multi-tenant dashboard to handle complex workspace permission roles',
    clientType: 'B2B FinTech Operations',
    problem: 'A rapidly growing financial SaaS application was experiencing massive security vulnerabilities and sluggish dashboard load times. Their monolithic API could not scale securely when large corporate clients added hundreds of sub-accounts with highly custom, dynamic database permission rules.',
    solution: 'We re-engineered the backend into a decoupled Node.js and Express microservices structure. By utilizing a hybrid database approach—using PostgreSQL for relational financial transactions and Redis for high-speed session tokens—we implemented a bulletproof Role-Based Access Control (RBAC) layer that securely signs and handles workspace data permissions on every request.',
    metrics: [
      { label: 'Dashboard Load Time', value: '0.4s', detail: 'Improved by 300%' },
      { label: 'Auth Token Verification', value: '12ms', detail: 'Ultra-fast Redis lookups' },
      { label: 'Security Breaches', value: 'Zero', detail: 'Validated by third-party audit' }
    ],
    techStack: ['Node.js', 'Express.js', 'PostgreSQL', 'Redis', 'Next.js']
  }
];

export default function CaseStudies() {
  const [activeTab, setActiveTab] = useState(caseStudiesData[0].id);
  const activeData = caseStudiesData.find(item => item.id === activeTab);

  return (
    <div className="py-20 px-4 border-t border-slate-800 antialiased">
      <div className="max-w-6xl mx-auto">
        
        {/* Component Header */}
        <div className="mb-16 max-w-2xl">
          <span className="text-indigo-500 font-semibold tracking-widest uppercase text-xs block mb-2">
            System Blueprints
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Engineering solutions for complex system problems
          </h2>
          <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
            An open lookup at the code architecture, bottlenecks, and raw telemetry data behind our latest software production deployments.
          </p>
        </div>

        {/* Tab Selection Switches (Minimal Line Style) */}
        <div className="flex border-b border-slate-800 gap-6 mb-12 overflow-x-auto pb-px scrollbar-none">
          {caseStudiesData.map((study) => (
            <button
              key={study.id}
              onClick={() => setActiveTab(study.id)}
              className={`py-3 font-medium text-sm transition-all whitespace-nowrap border-b-2 -mb-px focus:outline-none ${
                activeTab === study.id
                  ? 'border-indigo-500 text-indigo-500 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {study.tabTitle}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start"
          >
            
            {/* Left/Middle Columns: Diagnostic Flow */}
            <div className="lg:col-span-2 space-y-10">
              <div>
                <span className="text-xs font-semibold tracking-widest text-slate-500 uppercase block mb-1">
                  {activeData.clientType}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug">
                  {activeData.title}
                </h3>
              </div>

              {/* The Problem Segment */}
              <div className="border-l-2 border-red-500/40 pl-6 space-y-2">
                <div className="flex items-center gap-2 text-red-400 font-semibold text-xs uppercase tracking-wider">
                  <FiServer className="w-3.5 h-3.5 shrink-0" />
                  <span>The Architectural Bottleneck</span>
                </div>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {activeData.problem}
                </p>
              </div>

              {/* The Solution Segment */}
              <div className="border-l-2 border-emerald-500/40 pl-6 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
                  <FiDatabase className="w-3.5 h-3.5 shrink-0" />
                  <span>The Deployed Architecture</span>
                </div>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {activeData.solution}
                </p>
              </div>

              {/* Stack Framework Tags */}
              <div className="pt-4">
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 block mb-3">
                  Infrastructure Stack
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeData.techStack.map((tech, i) => (
                    <span 
                      key={i} 
                      className="border border-slate-800 text-slate-400 px-2.5 py-1 rounded-md text-xs font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Numeric Logs */}
            <div className="space-y-8 lg:border-l lg:border-slate-800 lg:pl-10">
              <div className="flex items-center gap-2 text-indigo-500 font-semibold text-xs uppercase tracking-widest">
                <FiActivity className="w-4 h-4" />
                <span>Performance Audit</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-6">
                {activeData.metrics.map((metric, i) => (
                  <div 
                    key={i} 
                    className="border-b border-slate-800/60 pb-4 last:border-none"
                  >
                    <span className="text-xs font-medium text-slate-500 block uppercase tracking-wider">
                      {metric.label}
                    </span>
                    <div className="text-2xl sm:text-3xl font-bold my-1 tracking-tight">
                      {metric.value}
                    </div>
                    <span className="text-xs text-slate-400 block">
                      {metric.detail}
                    </span>
                  </div>
                ))}
              </div>

              {/* Small Footnote Verification Note */}
              <div className="flex gap-2 items-start text-slate-500 pt-2">
                <FiCheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-indigo-500/70" />
                <p className="text-xs leading-relaxed">
                  Every runtime value is verified through automated production deployment logs.
                </p>
              </div>

            </div>

          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}