'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiCpu, FiDatabase, FiLayers, FiShield, FiSliders, FiActivity } from 'react-icons/fi';

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
    { value: '132', suffix: '+', label: 'Businesses Served', sub: 'across industries worldwide' },
    { value: '51', suffix: '+', label: 'International Brands', sub: 'trusting our solutions' },
    { value: '100', suffix: '%', label: 'Commitment', sub: 'to quality and performance' },
  ];

  const coreValues = [
    {
      icon: <FiCpu className="w-6 h-6 text-indigo-600" />,
      title: "Performance First Philosophy",
      desc: "We write highly optimized code using Next.js Server Components. No unnecessary client-side weight, no blocking scripts—just instantaneous rendering layout speeds right out of the box."
    },
    {
      icon: <FiDatabase className="w-6 h-6 text-indigo-600" />,
      title: "Secure & Relational Architectures",
      desc: "Our systems are built using strict database isolation. Whether applying row-level safety inside PostgreSQL or scaling schema rules, your business data views stay perfectly protected."
    },
    {
      icon: <FiLayers className="w-6 h-6 text-indigo-600" />,
      title: "Clean Decoupled Infrastructures",
      desc: "We split frontends seamlessly from backend application layers. This component-driven ecosystem ensures your internal software branches can adapt, mutate, or scale without causing regression bugs."
    }
  ];

  const techMatrix = [
    { category: "Frontend Core", tools: "Next.js (App Router), React, Tailwind CSS, TypeScript, Framer Motion" },
    { category: "Backend Engine", tools: "Node.js, Express.js, NestJS RESTful Services, Realtime WebSockets" },
    { category: "Storage & State", tools: "PostgreSQL Databases, MongoDB Architecture, Redis Token Caching" },
    { category: "Management CI/CD", tools: "GitHub Actions Automation, Docker Containers, AWS Virtual Cloud Platforms" }
  ];

  const managementPillars = [
    { icon: <FiShield className="w-5 h-5 text-primary shrink-0 mt-1" />, title: "Continuous Security Audits", desc: "Constant code dependency checking, vulnerability tracking, and automated SSL certificate rotations." },
    { icon: <FiSliders className="w-5 h-5 text-primary shrink-0 mt-1" />, title: "Query Speed Tuning", desc: "Routine database index maintenance to prevent slowdowns as transaction logging scales upwards." },
    { icon: <FiActivity className="w-5 h-5 text-primary shrink-0 mt-1" />, title: "Observability Metrics", desc: "Live memory utilization and response latency dashboards mapping exceptions in production instantly." }
  ];

  return (
    <div className="text-slate-900 w-full antialiased  pt-20">

      <section className="w-full p-4 md:p-10 lg:p-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="w-full"
        >
          <motion.span
            variants={fadeUp}
            className="inline-block uppercase tracking-[0.25em] text-xs font-bold text-slate-400 mb-8"
          >
            About Us
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl lg:text-8xl font-extrabold leading-[1.05] tracking-tight text-slate-900 mb-10"
          >
            Digital Solutions &<br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-slate-900 via-primary to-secondary">
              Business Innovation Network
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-2xl md:text-3xl font-medium leading-snug text-slate-650 mb-10 "
          >
            We build technology that{' '}
            <span className="text-slate-900 font-semibold">works, scales, and performs.</span>
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="text-lg text-slate-500 leading-relaxed  mb-14"
          >
            From concept to premium digital solutions — crafting fast, scalable web
            applications that seamlessly combine design, development, and management
            into one powerful ecosystem. Long-term partnerships, continuous growth.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white font-semibold rounded-full hover:bg-primary transition-all duration-300 shadow-md"
            >
              Explore Our Products
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border border-slate-200 text-slate-700 font-semibold rounded-full hover:border-primary-light hover:text-primary hover:bg-primary/10 transition-all duration-300"
            >
              Get in Touch →
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <div className="w-full h-px bg-slate-100" />

      <section className="w-full py-24 px-6  mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: '-40px' }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          {coreValues.map((value, i) => (
            <motion.div key={i} variants={fadeUp} className="flex flex-col gap-4">
              <div className="p-3 bg-slate-50 rounded-xl w-fit border border-slate-100">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">{value.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{value.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <div className="w-full h-px bg-slate-100" />

      {/* Dark Mid-Section Banner */}
      <section className="w-full py-32 px-6 bg-slate-900">
        <motion.div
          className=" mx-auto text-center flex flex-col items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={fadeUp}
        >
          <h2 className="text-5xl sm:text-7xl font-extrabold tracking-tighter leading-[1.05] text-white mb-8">
            every day,<br />for years.
          </h2>
          <p className="text-xl md:text-2xl text-slate-400 font-medium mb-14 leading-relaxed">
            We don&apos;t build tools to impress. We build tools to perform. Reliable software creates value quietly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/career"
              className="inline-flex items-center justify-center px-10 py-5 bg-white text-slate-900 text-lg font-bold rounded-full hover:bg-secondary hover:text-tertiary-light transition-colors shadow-xl"
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

      {/* Metrics Section */}
      <section className="w-full py-20 px-6">
        <div className=" mx-auto">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: '-80px' }}
            variants={stagger}
          >
            {metrics.map((m, i) => (
              <motion.div key={i} variants={fadeUp} className="flex flex-col">
                <span className="text-6xl md:text-8xl font-extrabold text-slate-900 tracking-tighter leading-none mb-3">
                  {m.value}
                  <span className="text-primary">{m.suffix}</span>
                </span>
                <span className="text-base font-bold text-slate-800 mb-1">{m.label}</span>
                <span className="text-sm text-slate-400">{m.sub}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="w-full h-px bg-slate-100" />

      {/* NEW SECTION 2: Stack Blueprint Matrix Row */}
      <section className="w-full py-24 px-6 mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: '-40px' }}
          variants={stagger}
          className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12"
        >
          <motion.div variants={fadeUp}>
            <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase block mb-2">Technical Standards</span>
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-900">Our Stack Infrastructure</h3>
            <p className="text-sm text-slate-500 mt-3 leading-relaxed ">
              We operate exclusively on fully typed, optimized modern languages that decouple safely and run seamlessly at scale.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="divide-y divide-slate-100 border-t border-b border-slate-100">
            {techMatrix.map((item, index) => (
              <div key={index} className="py-5 grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-2 sm:gap-6 text-sm">
                <span className="font-bold text-slate-800 uppercase tracking-wide text-xs pt-0.5">{item.category}</span>
                <span className="text-slate-600 font-mono text-xs sm:text-sm">{item.tools}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <div className="w-full h-px bg-slate-100" />

      {/* Evolving Timeline Section */}
      <section className="w-full py-24 px-6 bg-slate-50">
        <div className=" mx-auto grid md:grid-cols-[1fr_2fr] gap-20 items-start">

          <motion.div
            className="md:sticky md:top-28"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            variants={fadeUp}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
              Constantly <br />Evolving
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed ">
              The web moves fast, and so do we. We continuously refine our stack to ensure we are delivering the most secure, maintainable, and performant codebases possible.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col gap-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: '-80px' }}
            variants={stagger}
          >
            {timeline.map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="relative pl-10 pb-14 border-l-2 border-slate-200 last:border-transparent group"
              >
                <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-slate-300 group-hover:border-primary group-hover:bg-primary/10 transition-all duration-300" />
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-base text-slate-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      <div className="w-full h-px bg-slate-100" />

      {/* NEW SECTION 3: Long-term Web Management & Guardrails */}
      <section className="w-full py-24 px-6 ">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.span variants={fadeUp} className="text-xs font-bold tracking-widest text-indigo-600 uppercase block mb-2">Continuous Lifecycle</motion.span>
          <motion.h3 variants={fadeUp} className="text-3xl font-extrabold tracking-tight text-slate-900">Post-Launch Web Management</motion.h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {managementPillars.map((pillar, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              variants={fadeUp}
              className="border-t border-slate-200 pt-6 space-y-2"
            >
              <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                {pillar.icon}
                <span>{pillar.title}</span>
              </div>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed pl-7">{pillar.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="w-full h-px bg-slate-100" />

      {/* Philosophy Callout Footer */}
      <section className="w-full py-32 px-6">
        <div className=" mx-auto flex flex-col gap-24 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            variants={fadeUp}
          >
            <h2 className="text-3xl md:text-5xl font-semibold leading-tight text-slate-900 mb-8">
              We believe growth happens through real work. People here learn by building, experimenting, failing, and improving.
            </h2>
            <p className="text-xl text-slate-500  mx-auto leading-relaxed">
              We support learning through mentorship, knowledge sharing, and giving people ownership early. Growth is not a ladder. It&apos;s a journey.
            </p>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;