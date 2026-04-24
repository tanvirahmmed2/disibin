'use client'
import React, { useState } from 'react'
import { RiArrowDownSLine, RiInformationLine, RiCodeLine, RiSmartphoneLine, RiRobot2Line, RiFlashlightLine, RiFocus2Line, RiShieldCheckLine, RiLineChartLine, RiCheckLine } from 'react-icons/ri'
import { motion } from 'framer-motion'

const AboutPage = () => {
  const [activeFAQ, setActiveFAQ] = useState(null)

  const faqs = [
    {
      question: "Do you write copy?",
      answer: "Yes, we create high-converting copy including headlines, messaging, and structure tailored to your business goals."
    },
    {
      question: "What technologies do you use?",
      answer: "We use modern, scalable technologies like Next.js, React, Tailwind CSS, and robust backend frameworks such as Node.js and MongoDB."
    },
    {
      question: "How fast can we launch?",
      answer: "Typically, small websites take 2-4 days. More complex systems or custom web applications take 2-4 weeks depending on requirements."
    },
    {
      question: "Do you provide ongoing support?",
      answer: "Yes, we provide comprehensive maintenance, updates, and scaling support to ensure your digital assets continue to perform optimally."
    }
  ]

  const services = [
    { icon: RiCodeLine, title: "Premium Websites", desc: "Fast, SEO-optimized, and conversion-focused websites designed to turn visitors into customers." },
    { icon: RiSmartphoneLine, title: "Web & Mobile Apps", desc: "Custom applications including SaaS platforms, dynamic dashboards, and integrated business systems." },
    { icon: RiRobot2Line, title: "Automation Systems", desc: "Automate complex workflows, reduce manual work, and improve efficiency with smart, connected systems." }
  ]

  const features = [
    { icon: RiFlashlightLine, title: "Performance First", desc: "Optimized systems engineered for blazing fast load times and buttery smooth performance." },
    { icon: RiFocus2Line, title: "Business Focused", desc: "Everything we build is designed to generate leads, drive sales, and produce measurable results." },
    { icon: RiLineChartLine, title: "Smart Automation", desc: "Reduce repetitive operational tasks with intelligent, data-driven automated workflows." },
    { icon: RiShieldCheckLine, title: "Scalable Systems", desc: "Future-proof architecture designed to grow seamlessly alongside your business." }
  ]

  const process = [
    { title: "Discover", desc: "Understanding your core business goals, target audience, and technical requirements." },
    { title: "Design", desc: "Creating modern, user-focused UI/UX designs that align perfectly with your brand identity." },
    { title: "Build & Launch", desc: "Developing with precision, rigorous testing, and seamless deployment to production." }
  ]

  return (
    <main className="w-full min-h-screen bg-slate-50 pt-24 pb-20">
      
      {/* Hero Section */}
      <section className="mb-24">
        <div className="container-custom px-4 text-center max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-semibold uppercase tracking-widest border border-emerald-100">
            <RiInformationLine size={14} /> Our Story
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tighter leading-tight">
            Building the <span className="text-emerald-500">Digital Future.</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed">
            DisiBin is a premium digital agency specializing in high-performance websites, scalable applications, and intelligent automation systems.
          </p>
        </div>
      </section>

      {/* Mission Banner */}
      <section className="mb-24 px-4">
        <div className="container-custom">
          <div className="w-full p-12 md:p-20 bg-slate-900 rounded-3xl text-center flex flex-col gap-6 relative overflow-hidden shadow-xl shadow-slate-900/10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] -mr-20 -mt-20 opacity-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] -ml-20 -mb-20 opacity-20 pointer-events-none"></div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight relative z-10">Our Mission</h2>
            <p className="text-lg md:text-xl text-slate-300 font-medium leading-relaxed max-w-3xl mx-auto relative z-10">
              To deliver premium digital solutions that seamlessly combine design, development, and automation into one powerful ecosystem. We focus on long-term partnerships and continuous growth for our clients.
            </p>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="mb-24 px-4">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">What We Do</h2>
            <p className="text-slate-500 mt-3 font-medium">Delivering excellence across the digital spectrum.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:border-emerald-500/10 hover:shadow-md transition-all group">
                <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                  <service.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mb-24 px-4">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Why Choose Us</h2>
            <p className="text-slate-500 mt-3 font-medium">The distinct advantages of partnering with DisiBin.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-emerald-500/10 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <feature.icon size={20} className="text-emerald-500" />
                  <h3 className="font-bold text-slate-900">{feature.title}</h3>
                </div>
                <p className="text-slate-500 text-xs font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process & FAQ */}
      <section className="px-4">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Process */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Our Process</h2>
                <p className="text-slate-500 mt-2 font-medium">A systematic approach to delivering excellence.</p>
              </div>
              
              <div className="space-y-6">
                {process.map((step, i) => (
                  <div key={i} className="flex gap-6 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-emerald-500/10 transition-all group">
                    <div className="w-12 h-12 flex-shrink-0 bg-slate-50 text-slate-400 font-bold rounded-full flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                      0{i + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* FAQ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Common Questions</h2>
                <p className="text-slate-500 mt-2 font-medium">Everything you need to know about our services.</p>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden transition-all hover:border-emerald-500/10">
                    <button
                      onClick={() => setActiveFAQ(activeFAQ === i ? null : i)}
                      className="w-full p-6 text-left flex justify-between items-center focus:outline-none"
                    >
                      <span className="font-bold text-slate-900">{faq.question}</span>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${activeFAQ === i ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                        <RiArrowDownSLine size={20} className={`transform transition-transform duration-300 ${activeFAQ === i ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    <div className={`overflow-hidden transition-all duration-300 ${activeFAQ === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <p className="px-6 pb-6 text-slate-500 text-sm font-medium leading-relaxed border-t border-slate-50 pt-4">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

    </main>
  )
}

export default AboutPage