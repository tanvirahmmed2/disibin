'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronDown, FiArrowRight, FiLoader } from 'react-icons/fi'
import Link from 'next/link'
import axios from 'axios'

export default function FAQ() {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
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

  const toggle = (id) => setExpandedId(expandedId === id ? null : id)

  return (
    <section className="w-full p-4 md:p-20 antialiased">
      <div className="w-full ">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="font-poppins text-3xl sm:text-5xl font-semibold text-slate-900 tracking-tight mb-4">
            Frequently Asked{' '}
            <span className="text-primary font-bold">Questions</span>
          </h2>
          <p className="text-slate-500 font-poppins text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Questions about web development strategies, mobile applications, e-commerce systems, API integrations, or database safety? We have compiled answers to our most common inquiries.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <FiLoader className="w-8 h-8 text-primary animate-spin mb-3" />
            <p className="text-slate-500 text-sm font-poppins">Loading FAQs...</p>
          </div>
        ) : faqs.length === 0 ? (
          <div className="text-center py-16 px-4 bg-slate-50 rounded-3xl border border-slate-100 mb-10">
            <p className="text-slate-500 font-poppins text-sm">No FAQs available at the moment.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {faqs.map((faq, i) => {
                const isExpanded = expandedId === faq.id
                return (
                  <motion.div
                    layout
                    key={faq.id || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: i * 0.02 }}
                    className={`glass rounded-2xl overflow-hidden shadow-sm transition-all duration-300 ${
                      isExpanded ? 'shadow-primary/10 shadow-md' : 'hover:shadow-md'
                    }`}
                  >
                    <button
                      onClick={() => toggle(faq.id)}
                      className="w-full text-left px-6 py-5 flex justify-between items-center gap-4 group focus:outline-none cursor-pointer"
                    >
                      <span className={`font-poppins font-semibold text-base transition-colors duration-200 ${
                        isExpanded ? 'text-primary' : 'text-slate-900 group-hover:text-primary'
                      }`}>
                        {faq.question}
                      </span>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className={`shrink-0 transition-colors ${isExpanded ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'}`}
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
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-14 text-center bg-slate-900 text-white rounded-xl p-10 shadow-xl shadow-slate-200"
        >
          <h3 className="font-poppins text-xl font-bold mb-2">Still have a specific question about your project?</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto mb-7 font-poppins leading-relaxed">
            Get in touch directly to discuss your requirements, estimated timeline, custom features, or web & mobile app architecture.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold font-poppins px-6 py-3 text-sm rounded-xl transition-all duration-300 shadow-md shadow-primary/30"
          >
            Reach Out to Our Team <FiArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

      </div>
    </section>
  )
}