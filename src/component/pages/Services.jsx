'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { FiMonitor, FiSmartphone, FiCpu, FiLayers, FiTerminal, FiDatabase, FiCheckCircle } from 'react-icons/fi'

const coreServices = [
  {
    icon: FiMonitor,
    title: 'Enterprise Web Apps',
    focus: 'Multi-tenant dashboards, complex permission roles, secure financial transactions, and real-time data streaming.',
    ideal: 'SaaS platforms, multi-branch e-commerce, and business portals.',
    color: 'sky',
  },
  {
    icon: FiSmartphone,
    title: 'Mobile & Cross-Platform',
    focus: 'Native-feeling performance, offline capabilities, secure biometrics, and push notification systems.',
    ideal: 'Consumer apps, delivery tracking, and on-the-go business tools.',
    color: 'indigo',
  },
  {
    icon: FiCpu,
    title: 'System Automation & IoT',
    focus: 'Connecting hardware with cloud backends, cron-scheduled tasks, queue management, and central data monitoring dashboards.',
    ideal: 'Robotics control, automated workflows, and smart systems.',
    color: 'sky',
  },
]

const techStack = [
  { icon: FiLayers, title: 'Frontend Ecosystem', desc: 'Next.js App Router, React, Tailwind CSS, TypeScript, State Management.' },
  { icon: FiTerminal, title: 'Backend & APIs', desc: 'Node.js, Express.js, NestJS, Secure RESTful APIs, Realtime WebSockets.' },
  { icon: FiDatabase, title: 'Databases & Storage', desc: 'PostgreSQL (multi-branch), MongoDB, Redis, Supabase.' },
  { icon: FiCpu, title: 'Infrastructure & IoT', desc: 'Docker, GitHub Actions CI/CD, AWS/Vercel, MQTT IoT protocols.' },
]

const steps = [
  { phase: '01', title: 'Discovery & Database Architecture', desc: 'We map the entire system — PostgreSQL schema relationships, API endpoints, and multi-tenant boundaries — before writing a single line of code.' },
  { phase: '02', title: 'UI/UX Design & Prototyping', desc: 'Concepts become clickable, interactive prototypes. You see exactly how the app will look and flow before engineering begins.' },
  { phase: '03', title: 'Agile Sprints & Development', desc: 'Bi-weekly milestones with concurrent front/backend development. Live staging access throughout the build.' },
  { phase: '04', title: 'Rigorous Testing & QA', desc: 'Stress-test queries, security boundaries, responsive layouts, and automated tasks before any deployment.' },
  { phase: '05', title: 'Deployment & Continuous Integration', desc: 'Production launch with automated CI/CD pipelines and hardware-to-cloud sync for IoT/automation systems.' },
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: 'easeOut', delay },
})

export default function Services() {
  return (
    <div className="w-full antialiased space-y-6">

      {/* ── Hero ──────────────────────────────────────── */}
      <motion.section
        {...fadeUp()}
        className="w-full text-center py-20 px-4 rounded-[2.5rem] shadow-xl shadow-slate-100 flex flex-col items-center gap-5"
      >
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500 font-poppins">Our Services</span>
        <h2 className="font-poppins text-4xl md:text-5xl lg:text-6xl font-semibold text-slate-900 leading-tight max-w-4xl">
          We engineer{' '}
          <span className="gradient-text">high-performance</span>{' '}
          digital products from the ground up
        </h2>
        <p className="text-slate-500 font-poppins text-base max-w-xl leading-relaxed">
          Whether you need a massive multi-branch system or a real-time automation tool, we build with scalability, speed, and clean code in mind.
        </p>
      </motion.section>

      {/* ── What We Build ──────────────────────────────── */}
      <motion.section {...fadeUp(0.1)} className="w-full px-4 py-16">
        <div className="mb-10">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500 font-poppins block mb-2">Capabilities</span>
          <h3 className="font-poppins text-3xl font-semibold text-slate-900">What We Build</h3>
          <p className="text-slate-500 font-poppins text-sm mt-2 max-w-md">Tailored technical solutions backed by rock-solid architecture.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {coreServices.map((s, i) => (
            <motion.div
              key={s.title}
              {...fadeUp(i * 0.1 + 0.2)}
              className="group glass rounded-2xl p-6 shadow-sm hover:shadow-lg hover:shadow-sky-100/40 hover:-translate-y-1 transition-all duration-400 cursor-default"
            >
              <div className="w-11 h-11 rounded-xl bg-sky-50 flex items-center justify-center mb-4 group-hover:bg-sky-100 transition-colors">
                <s.icon className="w-5 h-5 text-sky-500" />
              </div>
              <h4 className="font-poppins font-bold text-slate-900 text-lg mb-2">{s.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed mb-3">{s.focus}</p>
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">Ideal For</span>
                <p className="text-sky-700 font-medium text-sm font-poppins">{s.ideal}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Tech Stack ─────────────────────────────────── */}
      <motion.section
        {...fadeUp(0.1)}
        className="w-full bg-slate-900 text-white py-16 px-6 rounded-[2.5rem] shadow-xl"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center gap-12">
            <div className="lg:w-80 shrink-0">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400 font-poppins block mb-3">Our Capabilities</span>
              <h3 className="font-poppins text-3xl font-semibold text-white mb-4">Tech Stack & Architecture</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-poppins">
                Lightweight, feature-packed stacks built for speed and heavy parallel data access. No bloat — just highly optimised frameworks that stay performant as you scale.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              {techStack.map((t, i) => (
                <motion.div
                  key={t.title}
                  {...fadeUp(i * 0.08 + 0.2)}
                  className="group bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 hover:border-sky-500/40 hover:bg-slate-800 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
                      <t.icon className="w-4 h-4 text-sky-400" />
                    </div>
                    <h4 className="font-poppins font-semibold text-slate-100 text-sm">{t.title}</h4>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">{t.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── How We Work ────────────────────────────────── */}
      <motion.section {...fadeUp(0.1)} className="w-full px-4 py-16">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500 font-poppins block mb-3">Our Process</span>
          <h3 className="font-poppins text-3xl font-semibold text-slate-900">Development System & How We Work</h3>
          <p className="mt-3 text-slate-500 text-sm font-poppins max-w-xl mx-auto">A systematic, multi-step pipeline built to launch projects predictably and securely.</p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-sky-200 via-slate-200 to-transparent" />

          <div className="space-y-10 pl-16">
            {steps.map((step, i) => (
              <motion.div
                key={step.phase}
                {...fadeUp(i * 0.08 + 0.1)}
                className="group relative"
              >
                {/* Phase bubble */}
                <div className="absolute -left-[2.6rem] top-0.5 w-7 h-7 rounded-full bg-sky-500 border-4 border-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-[8px] font-bold text-white">{step.phase}</span>
                </div>

                <div className="glass rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  <h4 className="font-poppins font-bold text-slate-900 mb-2">{step.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Guarantee banner */}
        <motion.div
          {...fadeUp(0.3)}
          className="mt-14 flex flex-col sm:flex-row items-start gap-4 bg-sky-50 border border-sky-100 rounded-2xl p-6 shadow-sm max-w-3xl mx-auto"
        >
          <FiCheckCircle className="w-6 h-6 text-sky-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-poppins font-bold text-slate-900 text-base mb-1">The Production Guarantee</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              All code we deliver is cleanly decoupled, type-safe, and shipped with descriptive markdown architecture documentation — so your engineers can safely inherit and scale it.
            </p>
          </div>
        </motion.div>
      </motion.section>

    </div>
  )
}