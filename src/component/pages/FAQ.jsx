'use client'
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiHelpCircle, FiGlobe, FiSettings, FiLayers } from 'react-icons/fi';

const faqData = [
  // --- GENERAL CATEGORY ---
  {
    id: 1,
    category: 'General',
    question: 'What types of digital platforms do you specialize in engineering?',
    answer: 'We specialize in building complex, data-driven web platforms that require stable backend logic, secure workflows, and smooth scaling. This includes high-performance SaaS applications, custom multi-branch enterprise software, B2B portals, and advanced headless e-commerce operations.'
  },
  {
    id: 2,
    category: 'General',
    question: 'How does your operational timeline and delivery structure look?',
    answer: 'Our software engineering lifecycles follow 5 strict phases: (1) Discovery & Relational Database Mapping, (2) UI/UX Component Design & Clickable Prototyping, (3) Agile Development Sprints with concurrent front/backend building, (4) Automated Performance & QA Stress-Testing, and (5) Monitored Production Deployment via isolated CI/CD pipelines.'
  },

  // --- WEB DEVELOPMENT CATEGORY ---
  {
    id: 3,
    category: 'Web Development',
    question: 'Which tech stacks do you use for your web applications?',
    answer: 'Our core architectural backbones are built on PERN (PostgreSQL, Express, React, Node) and MERN (MongoDB, Express, React, Node) environments. For the client facing layer, we build exclusively with Next.js using the App Router framework paired with Tailwind CSS to guarantee server-side rendering execution, fast load times, and clean styling.'
  },
  {
    id: 4,
    category: 'Web Development',
    question: 'How do you handle separate inventory and isolated views across multiple business branches?',
    answer: 'We architect our database models using relational boundaries, such as strict PostgreSQL schemas or multi-tenant database filtering logic. This ensures data views, inventory mutations, and analytics logs are isolated safely by branch ID, while allowing your team to control the system from a single unified global administration layout.'
  },
  {
    id: 5,
    category: 'Web Development',
    question: 'Are the web platforms you build fully optimized for Core Web Vitals and SEO?',
    answer: 'Yes. By utilizing Next.js Server Components and advanced Static Site Generation (SSG) or Incremental Static Regeneration (ISR), search engine web crawlers can scan your complete textual structure instantly without waiting for slow client-side JavaScript bundles to process. This ensures maximum indexation rates and high search performance scores.'
  },
  {
    id: 6,
    category: 'Web Development',
    question: 'How do you ensure web application security and prevent injection attacks?',
    answer: 'We enforce absolute security protocols right at the database layer. All incoming data vectors are scrubbed using parameterized queries and Object-Relational Mapping (ORM) sanitize rules to eliminate SQL injection risks. Furthermore, we establish strict Content Security Policies (CSP), secure HTTP cookies, and multi-factor authentication (MFA) mechanisms.'
  },

  // --- WEB MANAGEMENT CATEGORY ---
  {
    id: 7,
    category: 'Web Management',
    question: 'What is included in your full-service web management system?',
    answer: 'Our web management goes beyond basic hosting. It includes proactive cloud infrastructure scaling, monthly database indexing tuning to prevent query slowdowns, real-time security scanning, scheduled zero-downtime updates of packages, automated SSL renewals, and continual layout adjustments to adapt to shifting web standards.'
  },
  {
    id: 8,
    category: 'Web Management',
    question: 'How do you handle server monitoring, error tracking, and backups?',
    answer: 'We provision continuous observability tools across your server architecture. If an API endpoint throws an unhandled runtime exception or spikes in response latency, our team is instantly notified. Your database states are captured using isolated point-in-time snapshots every 24 hours, ensuring reliable disaster recovery with near-zero data loss.'
  },
  {
    id: 9,
    category: 'Web Management',
    question: 'How do you handle cloud scaling when traffic spikes unexpectedly?',
    answer: 'We configure server environments with automated scaling rules using cloud infrastructures like AWS or edge-optimized runtimes like Vercel. When concurrent API request metrics surge, the platform dynamically spawns isolated container instances to absorb the transactional load, shedding the compute power automatically when the traffic subsides.'
  },
  {
    id: 10,
    category: 'Web Management',
    question: 'Do you offer technical support SLAs for enterprise level applications?',
    answer: 'Yes, we provide structured Service Level Agreements (SLAs) tailored to your operational demands. This gives you a dedicated engineering line for emergency patch deployments, swift server environmental optimization, and continuous priority code maintenance to ensure maximum operational uptime.'
  }
];

const categories = [
  { name: 'All', icon: <FiHelpCircle className="w-4 h-4" /> },
  { name: 'General', icon: <FiLayers className="w-4 h-4" /> },
  { name: 'Web Development', icon: <FiGlobe className="w-4 h-4" /> },
  { name: 'Web Management', icon: <FiSettings className="w-4 h-4" /> }
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  // Filters questions based solely on the selected category tab
  const filteredFaqs = useMemo(() => {
    return faqData.filter(faq => activeCategory === 'All' || faq.category === activeCategory);
  }, [activeCategory]);

  const toggleAccordion = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="w-full min-h-screen text-slate-800 antialiased py-20 px-4">
      <div className="w-full mx-auto">
        
        <div className="text-center mb-16">
          <span className="text-indigo-600 font-semibold tracking-wider uppercase text-xs block mb-3">Support Ecosystem</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">Frequently Asked Questions</h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Have questions about server architecture, database safety, code design, web development strategies, or long-term system management? We have compiled responses to our most common operational inquiries.
          </p>
        </div>

        <div className="w-full flex justify-center mb-10 pb-6 border-b border-slate-200">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => { setActiveCategory(cat.name); setExpandedId(null); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeCategory === cat.name 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.icon}
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 w-full mx-auto">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.map((faq) => {
              const isExpanded = expandedId === faq.id;
              return (
                <motion.div
                  layout
                  key={faq.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm hover:border-slate-300 transition-colors"
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full text-left px-6 py-5 flex justify-between items-center gap-4 group focus:outline-none"
                  >
                    <span className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-indigo-600 transition-colors">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="text-slate-400 shrink-0 group-hover:text-slate-600"
                    >
                      <FiChevronDown className="w-5 h-5" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-6 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="mt-16 text-center bg-slate-950 text-white rounded-2xl p-8 shadow-sm border border-slate-800 max-w-4xl mx-auto">
          <h3 className="text-xl font-bold mb-2">Still have a specific architectural query?</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
            Get in touch directly to discuss server clustering, relational scaling boundaries, or specialized long-term web management frameworks.
          </p>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-2.5 text-sm rounded-xl transition-colors shadow-sm">
            Reach Out to Our Engineers
          </button>
        </div>

      </div>
    </div>
  );
}