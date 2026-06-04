'use client'
import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronDown, FiHelpCircle, FiGlobe, FiSettings, FiLayers, FiArrowRight } from 'react-icons/fi'
import Link from 'next/link'

const faqData = [
  {
    id: 1, category: 'General',
    question: 'What types of digital platforms do you specialise in engineering?',
    answer: 'We specialise in building complex, data-driven web platforms that require stable backend logic, secure workflows, and smooth scaling. This includes high-performance SaaS applications, custom multi-branch enterprise software, B2B portals, and advanced headless e-commerce operations.'
  },
  {
    id: 2, category: 'General',
    question: 'How does your operational timeline and delivery structure look?',
    answer: 'Our software engineering lifecycles follow 5 strict phases: (1) Discovery & Relational Database Mapping, (2) UI/UX Component Design & Clickable Prototyping, (3) Agile Development Sprints with concurrent front/backend building, (4) Automated Performance & QA Stress-Testing, and (5) Monitored Production Deployment via isolated CI/CD pipelines.'
  },
  {
    id: 3, category: 'Web Development',
    question: 'Which tech stacks do you use for your web applications?',
    answer: 'Our core architectural backbones are built on PERN (PostgreSQL, Express, React, Node) and MERN environments. For the client-facing layer we build exclusively with Next.js App Router paired with Tailwind CSS — guaranteeing server-side rendering, fast load times, and clean styling.'
  },
  {
    id: 4, category: 'Web Development',
    question: 'How do you handle separate inventory and isolated views across multiple business branches?',
    answer: 'We architect database models using relational boundaries — strict PostgreSQL schemas or multi-tenant filtering logic — ensuring data views, inventory mutations, and analytics logs are isolated by branch ID while allowing unified global administration.'
  },
  {
    id: 5, category: 'Web Development',
    question: 'Are the web platforms you build fully optimised for Core Web Vitals and SEO?',
    answer: 'Yes. By utilising Next.js Server Components and advanced Static Site Generation (SSG) or Incremental Static Regeneration (ISR), search engine web crawlers can scan your complete textual structure instantly — ensuring maximum indexation rates and high search performance scores.'
  },
  {
    id: 6, category: 'Web Development',
    question: 'How do you ensure web application security and prevent injection attacks?',
    answer: 'We enforce security at the database layer using parameterised queries and ORM sanitise rules to eliminate SQL injection. We also establish strict Content Security Policies (CSP), secure HTTP cookies, and multi-factor authentication (MFA) mechanisms.'
  },
  {
    id: 7, category: 'Web Management',
    question: 'What is included in your full-service web management system?',
    answer: 'Our web management goes beyond basic hosting — proactive cloud infrastructure scaling, monthly database indexing tuning, real-time security scanning, zero-downtime package updates, automated SSL renewals, and continual layout adjustments to shifting web standards.'
  },
  {
    id: 8, category: 'Web Management',
    question: 'How do you handle server monitoring, error tracking, and backups?',
    answer: 'We provision continuous observability tools across your server architecture. If an API endpoint throws an unhandled exception or spikes in latency, our team is instantly notified. Database states are captured in point-in-time snapshots every 24 hours for reliable disaster recovery.'
  },
  {
    id: 9, category: 'Web Management',
    question: 'How do you handle cloud scaling when traffic spikes unexpectedly?',
    answer: 'We configure server environments with automated scaling rules using AWS or edge-optimised runtimes like Vercel. When API request metrics surge, the platform dynamically spawns isolated container instances to absorb the load, shedding compute power automatically when traffic subsides.'
  },
  {
    id: 10, category: 'Web Management',
    question: 'Do you offer technical support SLAs for enterprise level applications?',
    answer: 'Yes. We provide structured Service Level Agreements (SLAs) tailored to your operational demands — including a dedicated engineering line for emergency patch deployments, server environmental optimisation, and continuous priority code maintenance.'
  },
]

const categories = [
  { name: 'All', icon: FiHelpCircle },
  { name: 'General', icon: FiLayers },
  { name: 'Web Development', icon: FiGlobe },
  { name: 'Web Management', icon: FiSettings },
]

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [expandedId, setExpandedId] = useState(null)

  const filteredFaqs = useMemo(() =>
    faqData.filter(faq => activeCategory === 'All' || faq.category === activeCategory),
    [activeCategory]
  )

  const toggle = (id) => setExpandedId(expandedId === id ? null : id)

  return (
    <section className="w-full py-20 px-4 antialiased">
      <div className="w-full max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500 font-poppins block mb-3">
            Support Ecosystem
          </span>
          <h2 className="font-poppins text-3xl sm:text-5xl font-semibold text-slate-900 tracking-tight mb-4">
            Frequently Asked{' '}
            <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-slate-500 font-poppins text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Questions about server architecture, database safety, web development strategies, or system management? We have compiled answers to our most common inquiries.
          </p>
        </motion.div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-2 justify-center mb-10"
        >
          {categories.map(cat => (
            <button
              key={cat.name}
              onClick={() => { setActiveCategory(cat.name); setExpandedId(null) }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold font-poppins transition-all duration-200 ${
                activeCategory === cat.name
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-200'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50'
              }`}
            >
              <cat.icon className="w-3.5 h-3.5" />
              {cat.name}
            </button>
          ))}
        </motion.div>

        {/* Accordion list */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.map((faq, i) => {
              const isExpanded = expandedId === faq.id
              return (
                <motion.div
                  layout
                  key={faq.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  className={`glass rounded-2xl overflow-hidden shadow-sm transition-all duration-300 ${
                    isExpanded ? 'shadow-sky-100/60 shadow-md' : 'hover:shadow-md'
                  }`}
                >
                  <button
                    onClick={() => toggle(faq.id)}
                    className="w-full text-left px-6 py-5 flex justify-between items-center gap-4 group focus:outline-none"
                  >
                    <span className={`font-poppins font-semibold text-base transition-colors duration-200 ${
                      isExpanded ? 'text-sky-600' : 'text-slate-900 group-hover:text-sky-600'
                    }`}>
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className={`shrink-0 transition-colors ${isExpanded ? 'text-sky-500' : 'text-slate-400 group-hover:text-slate-600'}`}
                    >
                      <FiChevronDown className="w-5 h-5" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-6 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100/80 pt-4 font-poppins">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* CTA footer */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 text-center bg-slate-900 text-white rounded-[2rem] p-10 shadow-xl shadow-slate-200"
        >
          <h3 className="font-poppins text-xl font-bold mb-2">Still have a specific architectural query?</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto mb-7 font-poppins leading-relaxed">
            Get in touch directly to discuss server clustering, relational scaling boundaries, or specialised long-term web management.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-semibold font-poppins px-6 py-3 text-sm rounded-xl transition-all duration-300 shadow-md shadow-sky-900/30 animate-pulse-glow"
          >
            Reach Out to Our Engineers <FiArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

      </div>
    </section>
  )
}