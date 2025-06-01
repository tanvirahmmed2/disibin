import React, { useState } from 'react';
import { motion } from 'framer-motion';

const webAppPackages = [
  {
    name: 'Basic',
    price: '$300',
    features: [
      'Landing page + contact form',
      'Responsive design (mobile/tablet/desktop)',
      'React or Next.js frontend',
      'Basic SEO setup',
      '5-day delivery',
    ],
  },
  {
    name: 'Standard',
    price: '$800',
    features: [
      'Full-featured web app (3–5 pages)',
      'Frontend + backend integration (Node.js / Firebase)',
      'Authentication (login/signup)',
      'Admin dashboard UI',
      '7-day delivery',
    ],
  },
  {
    name: 'Premium',
    price: '$1500+',
    features: [
      'Complex web app or SaaS platform',
      'Custom database & API integration',
      'User roles & advanced permissions',
      'Payment integration (Stripe/PayPal)',
      'Deployment (Vercel / Netlify / AWS)',
      '14–21 day delivery',
    ],
  },
];

export default function WebAppDevelopmentServices() { // Renamed component for clarity
  const [isPackVisible, setPackVisible] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('Basic');

  const togglePackVisibility = () => setPackVisible((prev) => !prev);
  const currentPackage = webAppPackages.find((pkg) => pkg.name === selectedPackage);

  return (
    <div className="px-6 py-4 flex flex-col gap-8 items-center justify-center w-full pt-20">
      <motion.h1
        initial={{ x: 100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold"
      >
        Web App Development Services
      </motion.h1>

      <p className="text-center max-w-3xl">
        Build fast, scalable, and responsive web apps tailored to your business. Whether it’s a landing page, dashboard, MVP, or full SaaS platform, we design and develop apps that are clean, secure, and production-ready.
      </p>

      <div className="features flex flex-col lg:flex-row gap-16 mt-4">
        {/* Core Services */}
        <motion.ul initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="bg-gray-300 p-8 rounded-xl flex flex-col gap-3 w-[400px]">
          <h3 className="font-bold">What’s Included</h3>
          <li>Modern frontend (React / Next.js)</li>
          <li>Responsive mobile-first design</li>
          <li>Backend logic & database (Node.js, Firebase)</li>
          <li>Auth, dashboard, admin panel</li>
          <li>API integrations (REST / GraphQL)</li>
          <li>Deployment & maintenance</li>
        </motion.ul>

        {/* Who It's For */}
        <motion.ul initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="bg-gray-300 p-8 rounded-xl flex flex-col gap-3 w-[400px]">
          <h3 className="font-bold">Perfect For</h3>
          <li>Startups building MVPs</li>
          <li>SaaS platforms & admin dashboards</li>
          <li>Internal tools & workflows</li>
          <li>Booking systems & CRMs</li>
          <li>E-commerce dashboards</li>
          <li>Educational & content platforms</li>
        </motion.ul>
      </div>

      <p className="max-w-2xl text-center">
        From concept to code — we’ll handle UI, backend, and launch. Let’s build your next web app together.
      </p>

      <div className="flex md:flex-row flex-col gap-4">
        <a className="px-4 py-2 bg-gray-300 rounded-xl cursor-pointer hover:bg-teal-200" href="mailto:disibin@gmail.com">
          Hire Developer
        </a>
        <button
          onClick={togglePackVisibility}
          className="px-4 py-2 bg-gray-300 rounded-xl cursor-pointer hover:bg-teal-200"
        >
          {isPackVisible ? 'Hide Packages' : 'View Packages'}
        </button>
      </div>

      {isPackVisible && (
        <div className="flex flex-col gap-8 items-center justify-center mt-4">
          <h1 className="text-2xl font-bold">Web App Packages:</h1>

          <div className="md:w-[526px] w-[405px] h-auto rounded-xl overflow-hidden border border-gray-300">
            <div className="bg-gray-300 flex">
              {webAppPackages.map((pkg) => (
                <h3
                  key={pkg.name}
                  onClick={() => setSelectedPackage(pkg.name)}
                  className={`w-full text-center py-2 cursor-pointer hover:bg-white ${selectedPackage === pkg.name ? 'bg-white' : ''
                  }`}
                >
                  {pkg.name}
                </h3>
              ))}
            </div>

            <div className="p-4 flex flex-col gap-4">
              <div className="flex justify-between">
                <h3>{currentPackage.name}</h3>
                <h3>{currentPackage.price}</h3>
              </div>
              <ul className="list-disc pl-5">
                {currentPackage.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
              <button className="w-full bg-gray-300 py-2 rounded-md">Continue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}