import React from 'react';
// Make sure to run: npm i react-icons
import { FiMonitor, FiSmartphone, FiCpu, FiLayers, FiTerminal, FiDatabase } from 'react-icons/fi';
import { HiOutlineCheckCircle } from 'react-icons/hi2';

export default function Services() {
  const coreServices = [
    {
      icon: <FiMonitor className="w-6 h-6 text-indigo-600" />,
      title: "Enterprise Web Apps",
      focus: "Multi-tenant dashboards, complex permission roles, secure financial transactions, and real-time data streaming.",
      ideal: "SaaS platforms, multi-branch e-commerce, and business portals."
    },
    {
      icon: <FiSmartphone className="w-6 h-6 text-indigo-600" />,
      title: "Mobile & Cross-Platform",
      focus: "Native-feeling performance, offline capabilities, secure biometrics, and push notification systems.",
      ideal: "Consumer apps, delivery tracking, and on-the-go business tools."
    },
    {
      icon: <FiCpu className="w-6 h-6 text-indigo-600" />,
      title: "System Automation & IoT",
      focus: "Connecting hardware with cloud backends, cron-scheduled tasks, queue management, and central data monitoring dashboards.",
      ideal: "Robotics control, automated workflows, and smart systems."
    }
  ];

  const steps = [
    {
      phase: "Phase 01",
      title: "Discovery & Database Architecture",
      desc: "Before writing code, we map out the entire system. We design your PostgreSQL/MongoDB schema relationships, define API endpoints, and structure multi-branch or multi-tenant boundaries to avoid bottlenecks later."
    },
    {
      phase: "Phase 02",
      title: "UI/UX Design & Prototyping",
      desc: "We transform concepts into clean, accessible user interfaces. You get a clickable, interactive prototype showing exactly how the web or mobile app will look and flow before engineering begins."
    },
    {
      phase: "Phase 03",
      title: "Agile Sprints & Development",
      desc: "We build using bi-weekly milestones. Frontend and backend are developed concurrently using Next.js and secure APIs. You get access to a private staging environment to watch progress live."
    },
    {
      phase: "Phase 04",
      title: "Rigorous Testing & QA",
      desc: "We stress-test the application. This includes testing database queries for speed, checking API security boundaries, confirming responsive layouts across all mobile screens, and verifying automated tasks."
    },
    {
      phase: "Phase 05",
      title: "Deployment & Continuous Integration",
      desc: "We deploy your system to production environments with automated CI/CD pipelines. If it's an automation/robotics system, we configure the hardware-to-cloud sync."
    }
  ];

  return (
    <div className="w-full min-h-screen text-slate-800 antialiased">
      {/* Hero Section */}
      <section className="w-full mx-auto px-4 pt-20 pb-16 text-center md:pt-32">
        <span className="text-indigo-600 font-semibold tracking-wider uppercase text-sm block mb-3">Our Services</span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto">
          We engineer high-performance digital products from the ground up
        </h1>
        <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
          Whether you need a massive multi-branch system or a real-time automation tool, we build with scalability, speed, and clean code in mind.
        </p>
      </section>

      {/* What We Build Section */}
      <section className="w-full mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">What We Build</h2>
        <p className="text-slate-600 mb-10 max-w-xl">Tailored technical solutions backed by rock-solid architecture.</p>
        
        {/* Desktop Table Layout */}
        <div className="hidden md:block overflow-hidden bg-white border border-slate-200 rounded-xl shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold text-sm uppercase tracking-wider">
                <th className="p-5 w-1/4">Capability</th>
                <th className="p-5 w-1/2">Core Focus</th>
                <th className="p-5 w-1/4">Ideal For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {coreServices.map((service, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="p-5 align-top">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 rounded-lg shrink-0">
                        {service.icon}
                      </div>
                      <span className="font-bold text-slate-900">{service.title}</span>
                    </div>
                  </td>
                  <td className="p-5 text-slate-600 leading-relaxed align-top">{service.focus}</td>
                  <td className="p-5 text-indigo-950 font-medium align-top">{service.ideal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards Stack */}
        <div className="grid grid-cols-1 gap-6 md:hidden">
          {coreServices.map((service, index) => (
            <div key={index} className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  {service.icon}
                </div>
                <h3 className="font-bold text-slate-900 text-lg">{service.title}</h3>
              </div>
              <div>
                <span className="text-xs font-semibold tracking-wider uppercase text-slate-400 block mb-1">Core Focus</span>
                <p className="text-slate-600 text-sm leading-relaxed">{service.focus}</p>
              </div>
              <div className="mt-auto pt-3 border-t border-slate-100">
                <span className="text-xs font-semibold tracking-wider uppercase text-slate-400 block mb-1">Ideal For</span>
                <p className="text-indigo-900 font-medium text-sm">{service.ideal}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack & Architecture */}
      <section className="w-full bg-slate-900 text-white py-20 my-12 rounded-2xl">
        <div className="w-full mx-auto px-4">
          <div className="lg:flex lg:items-center lg:justify-between gap-12">
            <div className="max-w-xl lg:shrink-0 mb-12 lg:mb-0">
              <span className="text-indigo-400 font-semibold tracking-wider uppercase text-sm block mb-2">Our Capabilities</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Tech Stack & Architecture</h2>
              <p className="text-slate-400 leading-relaxed">
                We design lightweight, feature-packed tech stacks built for speed and heavy parallel data access. No bloat—just highly optimized frameworks that stay performant as your business grows.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <FiLayers className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-semibold text-lg text-slate-100">Frontend Ecosystem</h3>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">Next.js (App Router), React, Tailwind CSS, TypeScript, State Management.</p>
              </div>

              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <FiTerminal className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-semibold text-lg text-slate-100">Backend & APIs</h3>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">Node.js, Express.js, NestJS, Secure RESTful APIs, Realtime WebSockets.</p>
              </div>

              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <FiDatabase className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-semibold text-lg text-slate-100">Databases & Storage</h3>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">PostgreSQL (Relational/Multi-branch architecture), MongoDB, Redis, Supabase.</p>
              </div>

              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <FiCpu className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-semibold text-lg text-slate-100">Infrastructure & IoT</h3>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">Docker, GitHub Actions (CI/CD), AWS/Vercel, MQTT IoT communication protocols.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work / Sequential Pipeline */}
      <section className="w-full mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Development System & How We Work</h2>
          <p className="mt-4 text-slate-600">A systematic, multi-step pipeline built to launch projects predictably and securely without delays.</p>
        </div>

        {/* Vertical Timeline Pipeline */}
        <div className="relative border-l border-slate-200 ml-4 md:ml-32 pl-8 md:pl-12 space-y-12">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Timeline bubble markers */}
              <div className="absolute -left-[41px] md:-left-[57px] top-1 bg-indigo-600 border-4 border-slate-50 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform" />
              
              <div className="hidden md:block absolute -left-44 top-1 w-28 text-right text-sm font-semibold tracking-wider text-indigo-600 uppercase">
                {step.phase}
              </div>

              <div>
                <span className="text-xs font-semibold uppercase text-indigo-600 md:hidden tracking-wider block mb-1">{step.phase}</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Production Guarantee Banner */}
        <div className="mt-20 bg-indigo-50 border border-indigo-100 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-start gap-4 shadow-sm">
          <HiOutlineCheckCircle className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-indigo-950 text-lg mb-1">The Production Guarantee</h4>
            <p className="text-indigo-900/80 text-sm leading-relaxed">
              All code we deliver is cleanly decoupled, type-safe, and shipped with descriptive markdown architecture documentation. This ensures your engineers can safely inherit and scale it down the line.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}