'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const AboutPage = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };

  const timeline = [
    { title: 'The Beginning', desc: 'Started with a passion for clean code, crafting responsive and intuitive user interfaces.' },
    { title: 'Full-Stack Mastery', desc: 'Expanded our expertise across modern stacks, integrating robust Express.js and PostgreSQL backends.' },
    { title: 'Modern Architectures', desc: 'Embraced Next.js and server-side rendering to deliver lightning-fast, SEO-optimized web applications.' },
    { title: 'Scalable Systems', desc: 'Engineered complex, data-driven platforms capable of handling high traffic with zero downtime.' },
    { title: 'The Future of Web', desc: 'Pushing the boundaries with edge computing, AI-driven features, and seamless web experiences.' },
  ];

  const metrics = [
    { value: '6', suffix: '+', label: 'Years of Excellence', sub: 'delivering premium results' },
    { value: '120', suffix: '+', label: 'Businesses Served', sub: 'across industries worldwide' },
    { value: '50', suffix: '+', label: 'International Brands', sub: 'trusting our solutions' },
    { value: '100', suffix: '%', label: 'Commitment', sub: 'to quality and performance' },
  ];

  return (
    <div className="bg-white text-slate-900 w-full">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="w-full max-w-7xl mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="max-w-4xl"
        >
          <motion.span
            variants={fadeUp}
            className="inline-block uppercase tracking-[0.25em] text-xs font-bold text-slate-400 mb-8"
          >
            About Us
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-7xl lg:text-8xl font-extrabold leading-[1.05] tracking-tight text-slate-900 mb-10"
          >
            We Are<br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-slate-900 via-sky-600 to-indigo-600">
              Developers
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-2xl md:text-3xl font-medium leading-snug text-slate-600 mb-10 max-w-3xl"
          >
            We build technology that{' '}
            <span className="text-slate-900 font-semibold">works, scales, and performs.</span>
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="text-lg text-slate-500 leading-relaxed max-w-2xl mb-14"
          >
            From concept to premium digital solutions — crafting fast, scalable web
            applications that seamlessly combine design, development, and automation
            into one powerful ecosystem. Long-term partnerships, continuous growth.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white font-semibold rounded-full hover:bg-sky-600 transition-all duration-300 shadow-md"
            >
              Explore Our Products
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border border-slate-200 text-slate-700 font-semibold rounded-full hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50 transition-all duration-300"
            >
              Get in Touch →
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <div className="w-full h-px bg-slate-100" />
      <section className="w-full py-32 px-6 bg-slate-900">
        <motion.div
          className="max-w-4xl mx-auto text-center flex flex-col items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className="text-5xl sm:text-7xl font-extrabold tracking-tighter leading-[1.05] text-white mb-8">
            every day,<br />for years.
          </h2>
          <p className="text-xl md:text-2xl text-slate-400 font-medium mb-14 max-w-2xl leading-relaxed">
            We don&apos;t build tools to impress. We build tools to perform. Reliable software creates value quietly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/career"
              className="inline-flex items-center justify-center px-10 py-5 bg-white text-slate-900 text-lg font-bold rounded-full hover:bg-sky-50 transition-colors shadow-xl"
            >
              Join our team
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-10 py-5 border border-white/20 text-white text-lg font-semibold rounded-full hover:bg-white/10 transition-colors"
            >
              View our products
            </Link>
          </div>
        </motion.div>
      </section>

      <div className="w-full h-px bg-slate-100" />

      <section className="w-full py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {metrics.map((m, i) => (
              <motion.div key={i} variants={fadeUp} className="flex flex-col">
                <span className="text-6xl md:text-8xl font-extrabold text-slate-900 tracking-tighter leading-none mb-3">
                  {m.value}
                  <span className="text-sky-500">{m.suffix}</span>
                </span>
                <span className="text-base font-bold text-slate-800 mb-1">{m.label}</span>
                <span className="text-sm text-slate-400">{m.sub}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="w-full h-px bg-slate-100" />

      <section className="w-full py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-[1fr_2fr] gap-20 items-start">

          <motion.div
            className="md:sticky md:top-28"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
              Constantly <br />Evolving
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed max-w-xs">
           The web moves fast, and so do we. We continuously refine our stack to ensure we are delivering the most secure, maintainable, and performant codebases possible. </p>
          </motion.div>

          <motion.div
            className="flex flex-col gap-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {timeline.map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="relative pl-10 pb-14 border-l-2 border-slate-200 last:border-transparent group"
              >
                <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-slate-300 group-hover:border-sky-500 group-hover:bg-sky-50 transition-all duration-300" />

                <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-base text-slate-500 leading-relaxed max-w-lg">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      <section className="w-full py-32 px-6">
        <div className="max-w-5xl mx-auto flex flex-col gap-24 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-3xl md:text-5xl font-semibold leading-tight text-slate-900 mb-8">
              We believe growth happens through real work. People here learn by building, experimenting, failing, and improving.
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              We support learning through mentorship, knowledge sharing, and giving people ownership early. Growth is not a ladder. It&apos;s a journey.
            </p>
          </motion.div>
        </div>
      </section>


    </div>
  );
};

export default AboutPage;

