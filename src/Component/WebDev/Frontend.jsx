import React, { useState } from 'react';
import { motion } from 'framer-motion'; // Corrected import path for framer-motion

const frontendPackages = [
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

export default function FrontendServices() { // Renamed component for clarity
  const [isPackVisible, setPackVisible] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('Basic'); // Default to Basic

  const togglePackVisibility = () => setPackVisible((prev) => !prev);
  const currentPackage = frontendPackages.find((pkg) => pkg.name === selectedPackage);

  return (
    <div className="px-6 py-4 flex flex-col gap-8 items-center justify-center w-full pt-20">
      <motion.h1
        initial={{ x: 100, opacity: 0 }} // Added opacity for initial motion as in template
        whileInView={{ x: 0, opacity: 1 }} // Added opacity for whileInView motion as in template
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold"
      >
        Build Your WebSite
      </motion.h1>

      <p className="text-center max-w-3xl">
        We build websites that go beyond just looking good — we focus on performance, functionality, and user experience. Our web development services are tailored to meet the unique needs of your business, helping you establish a powerful and effective online presence. We work with the latest web technologies to create fast, secure, and scalable websites that work flawlessly across all devices and browsers. Whether you need a simple business website, a feature-rich web application, or a custom solution, we’ve got you covered.
      </p>

      <div className="features flex flex-col lg:flex-row gap-16 mt-4">
        {/* What we offer */}
        <motion.ul initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="bg-gray-300 p-8 rounded-xl flex flex-col gap-3 w-[400px]">
          <h3 className="font-bold">What we offer:</h3>
          <p>Custom Website Development – Built from scratch to match your exact needs and branding.</p>
          <li><p>Responsive Design – Your site will look great and work perfectly on desktops, tablets, and smartphones.</p></li>
          <li><p>Content Management Systems (CMS) – Easy-to-manage websites using WordPress, Webflow, or custom CMS.</p></li>
          <li><p>Web Applications – Dynamic, interactive apps tailored to your business processes.</p></li>
          <li><p>API Integration – Connect your website with third-party tools and platforms.</p></li>
        </motion.ul>

        {/* Why choose us */}
        <motion.ul initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="bg-gray-300 p-8 rounded-xl flex flex-col gap-3 w-[400px]">
          <h3 className="font-bold">Why choose us:</h3>
          <p>Experienced developers focused on quality code</p>
          <li><p>Fast-loading, SEO-optimized websites</p></li>
          <li><p>Secure development practices</p></li>
          <li><p>Clear communication and collaboration throughout the project</p></li>
          <li><p>Maintenance & Support – Ongoing updates, bug fixes, and improvements.</p></li>
        </motion.ul>
      </div>

      <p className="max-w-2xl text-center">
        A strong brand is your most valuable asset — let us help you craft it, grow it, and make it unforgettable.
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
          <h1 className="text-2xl font-bold">Build Your Perfect Website</h1> {/* Updated heading */}

          <div className="md:w-[526px] w-[405px] rounded-xl overflow-hidden border border-gray-300">
            <div className="bg-gray-300 flex">
              {frontendPackages.map((pkg) => ( // Use frontendPackages
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