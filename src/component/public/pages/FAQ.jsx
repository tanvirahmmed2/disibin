'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronDown, FiHelpCircle, FiGlobe, FiSettings, FiLayers, FiArrowRight, FiLoader } from 'react-icons/fi'
import Link from 'next/link'
import axios from 'axios'

export default function FAQ() {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    fetchFaqs()
  }, [])

  const fetchFaqs = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/public/faq')
      if (res.data.success) {
        setFaqs(res.data.data || [])
      }
    } catch (error) {
      console.error('Failed to load FAQs:', error)
    } finally {
      setLoading(false)
    }
  }

  // Dynamically compute category buttons from DB records
  const categoryList = useMemo(() => {
    const set = new Set(faqs.map(item => item.category).filter(Boolean))
    return ['All', ...Array.from(set)]
  }, [faqs])

  const filteredFaqs = useMemo(() =>
    faqs.filter(faq => activeCategory === 'All' || faq.category === activeCategory),
    [faqs, activeCategory]
  )

  const toggle = (id) => setExpandedId(expandedId === id ? null : id)

  return (
    <section className="w-full py-20 px-4 antialiased">
      <div className="w-full max-w-5xl mx-auto">

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

        {/* Category Filters */}
        {!loading && categoryList.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap gap-2 justify-center mb-10"
          >
            {categoryList.map(catName => (
              <button
                key={catName}
                onClick={() => { setActiveCategory(catName); setExpandedId(null) }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold font-poppins transition-all duration-200 ${
                  activeCategory === catName
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-200'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50'
                }`}
              >
                <FiHelpCircle className="w-3.5 h-3.5" />
                {catName}
              </button>
            ))}
          </motion.div>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <FiLoader className="w-8 h-8 text-sky-500 animate-spin mb-3" />
            <p className="text-slate-500 text-sm font-poppins">Loading FAQs...</p>
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="text-center py-16 px-4 bg-slate-50 rounded-3xl border border-slate-100 mb-10">
            <p className="text-slate-500 font-poppins text-sm">No FAQs available at the moment.</p>
          </div>
        ) : (
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
                          <div className="px-6 pb-6 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100/80 pt-4 font-poppins whitespace-pre-line">
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
        )}

        {/* CTA footer */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 text-center bg-slate-900 text-white rounded-xl p-10 shadow-xl shadow-slate-200"
        >
          <h3 className="font-poppins text-xl font-bold mb-2">Still have a specific architectural query?</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto mb-7 font-poppins leading-relaxed">
            Get in touch directly to discuss server clustering, relational scaling boundaries, or specialised long-term web management.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white font-semibold font-poppins px-6 py-3 text-sm rounded-xl transition-all duration-300 shadow-md shadow-sky-900/30 animate-pulse-glow"
          >
            Reach Out to Our Engineers <FiArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

      </div>
    </section>
  )
}