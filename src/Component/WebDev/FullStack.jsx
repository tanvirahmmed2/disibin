import React, { useState } from 'react';
import { motion } from 'framer-motion'; // Corrected import path for framer-motion

const fullStackPackages = [
  {
    name: 'Basic',
    price: '$80',
    features: [
      'High Converting Landing Page design, Premium theme, BLOG, Image Slider, Social Media, Contact Form',
      'Functional website',
      '1 page',
      'Responsive design',
      'Content upload',
      'Opt-in form',
      '5 plugins/extensions including social media',
      '3-day delivery',
      '3 Revisions',
    ],
  },
  {
    name: 'BUSINESS', // Name from source
    price: '$350',
    features: [
      '4 Page Responsive Website',
      'Basic + Security',
      'Stock Images',
      'Page Builder',
      'Google Map',
      'Support',
      'Functional website',
      '4 pages',
      'Responsive design',
      'Content upload',
      'Hosting setup',
      '7 plugins/extensions including social media link',
      '5-day delivery',
      '5 Revisions',
    ],
  },
  {
    name: 'BUSINESS PLUS', // Name from source
    price: '$550',
    features: [
      '7 Page Commercial website development (10 products)',
      'Standard Features Included', // Referring to the 'BUSINESS' package features
      'Speed & SEO optimized',
      'Color Branding',
      'Functional website',
      '7 pages',
      'Responsive design',
      'Content upload',
      '10 plugins/extensions',
      'Hosting setup & Speed optimization',
      '7-day delivery',
      '7 Revisions',
    ],
  },
];

export default function FullStackServices() { // Renamed component for clarity
  const [isPackVisible, setPackVisible] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('Basic'); // Default to Basic

  const togglePackVisibility = () => setPackVisible((prev) => !prev);
  const currentPackage = fullStackPackages.find((pkg) => pkg.name === selectedPackage);

  return (
    <div className="px-6 py-4 flex flex-col gap-8 items-center justify-center w-full pt-20">
      <motion.h1
        initial={{ x: 100, opacity: 0 }} // Added opacity for initial motion as in template
        whileInView={{ x: 0, opacity: 1 }} // Added opacity for whileInView motion as in template
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold"
      >
        Build Your Interface with Strong DataBase
      </motion.h1>

      <p className="text-center max-w-3xl">
        We deliver complete end-to-end web development solutions — from intuitive user interfaces to robust backend systems. As full stack developers, we handle both the front and back ends of your project, ensuring seamless integration, faster delivery, and unified quality across your entire application. Whether you're building a landing page, SaaS product, or complex business platform, we provide the full technical package.
      </p>

      <div className="features flex flex-col lg:flex-row gap-16 mt-4">
        {/* What we offer */}
        <motion.ul initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="bg-gray-300 p-8 rounded-xl flex flex-col gap-3 w-[400px]">
          <h3 className="font-bold">What we offer:</h3>
          <p>Complete Web Development – One team to handle everything from UI design to database management and deployment.</p>
          <li><p>Modern Frontend Frameworks – Responsive, interactive interfaces built with React, Vue, or other modern technologies.</p></li>
          <li><p>Scalable Backend Architecture – Secure and performant server-side logic built with Node.js, Express, Django, or similar.</p></li>
          <li><p>Database Integration – Setup and management of relational (PostgreSQL, MySQL) or NoSQL (MongoDB) databases.</p></li>
          <li><p>API Development & Integration – Seamless connection between frontend, backend, and third-party services.</p></li>
        </motion.ul>

        {/* Why choose us */}
        <motion.ul initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="bg-gray-300 p-8 rounded-xl flex flex-col gap-3 w-[400px]">
          <h3 className="font-bold">Why choose us:</h3>
          <p>Single point of contact for your entire tech stack</p>
          <li><p>Faster development and better coordination between frontend and backend</p></li>
          <li><p>Clean, scalable, and maintainable codebase</p></li>
          <li><p>Transparent communication and agile workflows</p></li>
          <li><p>Post-launch support, updates, and performance monitoring</p></li>
        </motion.ul>
      </div>

      <p className="max-w-2xl text-center">
        We bring your digital vision to life — handling every layer of your web application so you can focus on growth, not the tech.
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
              {fullStackPackages.map((pkg) => ( // Use fullStackPackages
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