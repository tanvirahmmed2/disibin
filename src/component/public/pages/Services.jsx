'use client'
import React from 'react'
import { motion } from 'framer-motion'
import {
  FiMonitor,
  FiSmartphone,
  FiTrendingUp,
  FiCloud,
  FiShield,
  FiCheckCircle,
  FiArrowRight,
  FiLayers,
  FiCpu,
  FiGitBranch
} from 'react-icons/fi'

const coreServices = [
  {
    icon: FiMonitor,
    title: 'Enterprise Web Apps',
    badge: 'Core Platform',
    desc: 'Multi-tenant dashboards, complex permission management, secure financial transactions, and real-time data streaming.',
    ideal: 'SaaS platforms, e-commerce, and business portals.',
  },
  {
    icon: FiSmartphone,
    title: 'Mobile Applications',
    badge: 'Mobile Systems',
    desc: 'Native-feeling cross-platform mobile apps built with offline synchronization, biometric security, and push notifications.',
    ideal: 'Consumer apps, field operations, and mobile tools.',
  },
  {
    icon: FiTrendingUp,
    title: 'Business Innovation',
    badge: 'Growth Engine',
    desc: 'AI-assisted process automation, executive decision dashboards, and legacy system modernization without downtime.',
    ideal: 'Scaling enterprises and digital transformations.',
  },
  {
    icon: FiCloud,
    title: 'Cloud Architecture',
    badge: 'Infrastructure',
    desc: 'High-availability microservices, automated CI/CD deployment pipelines, cloud cost optimization, and secure API gateways.',
    ideal: 'High-traffic applications and scalable backends.',
  },
]

const treeSteps = [
  {
    phase: '01',
    title: 'Discovery & Business Architecture',
    subtitle: 'System Blueprint & Schema Design',
    desc: 'We map PostgreSQL database relationships, multi-tenant boundaries, role-based access control (RBAC), and security requirements before writing code.',
    activities: [
      'Database ERD & Schema Mapping',
      'API Contract & Endpoints Design',
      'Multi-tenant Boundary Definition',
      'Security & Risk Assessment'
    ],
    deliverable: 'Complete Architecture Blueprint',
  },
  {
    phase: '02',
    title: 'UI/UX Strategy & Interactive Prototyping',
    subtitle: 'Clickable Prototypes & Design Tokens',
    desc: 'Transforming requirements into clickable high-fidelity prototypes. You validate user journeys, admin dashboards, and component design tokens early.',
    activities: [
      'Responsive Component Specs',
      'High-Fidelity Wireframing',
      'Interactive User Flow Simulation',
      'Design Token Standardization'
    ],
    deliverable: 'Interactive Staging Prototype',
  },
  {
    phase: '03',
    title: 'Agile Innovation & Sprint Engineering',
    subtitle: 'Parallel Front & Backend Execution',
    desc: 'Bi-weekly sprint milestones with continuous integration. Clean modular codebase, type safety, and real-time staging preview access throughout the build.',
    activities: [
      'Concurrent API & UI Development',
      'Type-Safe TypeScript Implementation',
      'Automated CI/CD Pipeline Setup',
      'Bi-Weekly Milestone Demonstrations'
    ],
    deliverable: 'Production-Ready Staging Code',
  },
  {
    phase: '04',
    title: 'Rigorous QA & Security Boundary Testing',
    subtitle: 'Stress Testing & Rate-Limiting Audits',
    desc: 'Comprehensive performance and security validation. Query load testing, multi-role permission isolation checks, and responsive design audits.',
    activities: [
      'SQL Query Indexing & Load Tests',
      'Role Isolation & Security Audit',
      'Cross-Device & Browser Testing',
      'API Rate Limiting & Auth Checks'
    ],
    deliverable: 'QA & Security Certificate',
  },
  {
    phase: '05',
    title: 'Production Deployment & Continuous Growth',
    subtitle: 'Zero-Downtime Launch & Telemetry',
    desc: 'Production release using automated database migrations, cloud edge caching, live performance telemetry, and descriptive architecture documentation.',
    activities: [
      'Zero-Downtime Pipeline Launch',
      'Edge Cache & DNS Optimization',
      'Real-Time Telemetry & Monitoring',
      'Technical Documentation Hand-off'
    ],
    deliverable: 'Live Production Platform',
  },
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: 'easeOut', delay },
})

export default function Services() {
  return (
    <div className="w-full antialiased space-y-16 py-6">

      <motion.section {...fadeUp()} className="w-full text-center max-w-3xl mx-auto px-4 space-y-4">
        
        <h2 className="font-poppins text-3xl sm:text-5xl font-semibold text-slate-900 leading-tight">
          We engineer <span className="gradient-text font-bold">high-performance</span> digital products
        </h2>
        <p className="text-slate-500 font-poppins text-base max-w-xl mx-auto leading-relaxed">
          From enterprise web applications to business process innovation, we engineer software designed for speed, scale, and long-term performance.
        </p>
      </motion.section>

      <motion.section {...fadeUp(0.1)} className="w-full px-2">
        <div className="mb-8 text-center sm:text-left">
         <h3 className="font-poppins text-2xl sm:text-3xl font-semibold text-slate-900">What We Build</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreServices.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.title}
                {...fadeUp(i * 0.08 + 0.1)}
                className="glass rounded-2xl p-6 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between border border-slate-200/80 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      {s.badge}
                    </span>
                  </div>

                  <h4 className="font-poppins font-bold text-slate-900 text-lg mb-2 group-hover:text-primary transition-colors">{s.title}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed mb-4 font-poppins">{s.desc}</p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Ideal For</span>
                  <p className="text-slate-800 font-medium text-xs font-poppins">{s.ideal}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.section>

      <motion.section {...fadeUp(0.1)} className="w-full px-2">
        <div className="mb-12 text-center">
          
          <h3 className="font-poppins text-2xl sm:text-4xl font-semibold text-slate-900">How We Work & Launch</h3>
          <p className="text-slate-500 text-sm mt-2 max-w-lg mx-auto font-poppins">
            A structured 5-phase engineering tree designed to deliver high-quality software predictably.
          </p>
        </div>

        <div className="relative pl-6 sm:pl-10 space-y-10">
          <div className="absolute left-3.5 sm:left-5 top-3 bottom-3 w-0.5 bg-linear-to-b from-primary via-primary-light to-transparent" />

          {treeSteps.map((step, i) => (
            <motion.div
              key={step.phase}
              {...fadeUp(i * 0.1 + 0.1)}
              className="relative flex flex-col sm:flex-row items-start gap-6 group"
            >
              {/* Tree Node Marker */}
              <div className="absolute -left-6 sm:-left-10 top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border-3 border-primary shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:bg-primary transition-all duration-300 z-10">
                <span className="text-[10px] font-bold text-primary group-hover:text-white transition-colors">{step.phase}</span>
              </div>

              {/* Step Card Content */}
              <div className="w-full glass rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary font-poppins block">
                      Phase {step.phase} • {step.subtitle}
                    </span>
                    <h4 className="font-poppins font-bold text-slate-900 text-lg sm:text-xl">{step.title}</h4>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full shrink-0 font-poppins self-start sm:self-auto">
                    {step.deliverable}
                  </span>
                </div>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-poppins">{step.desc}</p>

                {/* Key Activities List */}
                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-poppins block mb-2.5">
                    Core Engineering Activities
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {step.activities.map((act) => (
                      <div key={act} className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <FiCheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Commitment Banner */}
        <div className="mt-12 glass border border-primary/20 bg-primary/5 rounded-2xl p-5 flex items-center gap-4">
          <FiShield className="w-6 h-6 text-primary shrink-0" />
          <p className="text-slate-700 text-xs leading-relaxed font-poppins">
            <strong className="text-slate-900">Production Guarantee:</strong> Clean, modular codebases with full technical documentation and type safety, ensuring seamless scalability for your team.
          </p>
        </div>
      </motion.section>

    </div>
  )
}