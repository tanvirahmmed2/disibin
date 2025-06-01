import React, { useState } from 'react';
import { motion } from 'framer-motion'; // Corrected import path for framer-motion

const backendPackages = [
  {
    name: 'Basic',
    price: '$80',
    features: [
      'High Converting Landing Page design, Premium theme, BLOG, Image Slider, Social Media, Contact Form',
      'Functional website (1 page)',
      'Responsive design',
      'Content upload',
      'Opt-in form',
      '5 plugins/extensions including social media',
      '3-day delivery',
      '3 Revisions',
    ],
  },
  {
    name: 'BUSINESS', // Changed name from 'Standard' as per source
    price: '$350',
    features: [
      '4 Page Responsive Website',
      'Basic + Security',
      'Stock Images',
      'Page Builder',
      'Google Map',
      'Support',
      'Functional website (4 pages)',
      'Responsive design',
      'Content upload',
      'Hosting setup',
      '7 plugins/extensions including social media link',
      '5-day delivery',
      '5 Revisions',
    ],
  },
  {
    name: 'BUSINESS PLUS', // Changed name from 'Premium' as per source
    price: '$550',
    features: [
      '7 Page Commercial website development (10 products)',
      'Standard Features Included', // Referring to the 'BUSINESS' package features
      'Speed & SEO optimized',
      'Color Branding',
      'Functional website (7 pages)',
      'Responsive design',
      'Content upload',
      '10 plugins/extensions',
      'Hosting setup & Speed optimization',
      '7-day delivery',
      '7 Revisions',
    ],
  },
];

export default function BackendServices() { // Renamed component for clarity
  const [isPackVisible, setPackVisible] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('Basic'); // Default to Basic

  const togglePackVisibility = () => setPackVisible((prev) => !prev);
  const currentPackage = backendPackages.find((pkg) => pkg.name === selectedPackage);

  return (
    <div className="px-6 py-4 flex flex-col gap-8 items-center justify-center w-full pt-20">
      <motion.h1
        initial={{ x: 100, opacity: 0 }} // Added opacity for initial motion as in template
        whileInView={{ x: 0, opacity: 1 }} // Added opacity for whileInView motion as in template
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold"
      >
        Build Your DataBase
      </motion.h1>

      <p className="text-center max-w-3xl">
        We build robust backend systems that power high-performance, scalable, and secure applications. Our backend development services ensure your business logic, data handling, and integrations work seamlessly behind the scenes. Whether you need an API-driven architecture, complex data processing, or scalable infrastructure, we provide the foundation your digital product needs to succeed.
      </p>

      <div className="features flex flex-col lg:flex-row gap-16 mt-4">
        {/* What we offer */}
        <motion.ul initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="bg-gray-300 p-8 rounded-xl flex flex-col gap-3 w-[400px]">
          <h3 className="font-bold">What we offer:</h3>
          <p>Custom Backend Development – Tailored solutions built to handle your specific business logic, processes, and workflows.</p>
          <li><p>Database Design & Management – Efficient and secure data storage using MySQL, PostgreSQL, MongoDB, and more.</p></li>
          <li><p>API Development – RESTful and GraphQL APIs to connect your frontend, mobile apps, or third-party services.</p></li>
          <li><p>Authentication & Security – Secure user authentication, authorization, and data protection practices.</p></li>
          <li><p>Server & Infrastructure Setup – Scalable deployments using modern cloud services like AWS, Render, and DigitalOcean.</p></li>
        </motion.ul>

        {/* Why choose us */}
        <motion.ul initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="bg-gray-300 p-8 rounded-xl flex flex-col gap-3 w-[400px]">
          <h3 className="font-bold">Why choose us:</h3>
          <p>Skilled backend engineers with deep expertise in modern frameworks (Node.js, Express, Django, etc.)</p>
          <li><p>Secure coding practices and data privacy standards</p></li>
          <li><p>Scalable and performance-optimized systems</p></li>
          <li><p>Clean, maintainable code with thorough documentation</p></li>
          <li><p>Ongoing support, monitoring, and feature upgrades</p></li>
        </motion.ul>
      </div>

      <p className="max-w-2xl text-center">
        A strong backend is the engine that drives your application — let us build the technology that keeps your business running smoothly and securely.
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
          <h1 className="text-2xl font-bold">Build Your Fast DataBase</h1> {/* Updated heading */}

          <div className="md:w-[526px] w-[405px] rounded-xl overflow-hidden border border-gray-300">
            <div className="bg-gray-300 flex">
              {backendPackages.map((pkg) => ( // Use backendPackages
                <h3
                  key={pkg.name}
                  onClick={() => setSelectedPackage(pkg.name)}
                  className={`w-full text-center py-2 cursor-pointer hover:bg-white ${
                    selectedPackage === pkg.name ? 'bg-white' : ''
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