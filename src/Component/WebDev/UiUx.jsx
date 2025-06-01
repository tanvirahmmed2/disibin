import React, { useState } from 'react';
import { motion } from 'framer-motion'; // Corrected import path for framer-motion

import usePageTitle from '../usePageTitle'

const uiUxPackages = [
  {
    name: 'Figma Landing Page Design',
    price: '$100',
    features: [
      'Custom Landing Page Design (Upto 5 Sections) with Figma | Responsive | No Coding | Discuss More',
      '1 page',
      'Responsive design',
      'Source file',
      'Unlimited Revisions',
      '3-day delivery',
    ],
  },
  {
    name: 'Homepage + 4 Inner Pages in Figma',
    price: '$400',
    features: [
      'Unique Web Homepage + 4 Inner Pages Design in Figma (Desktop + Mobile) | No Coding | Discuss More',
      '5 pages',
      'Responsive design',
      'Source file',
      'Unlimited Revisions',
      '7-day delivery',
    ],
  },
  {
    name: 'Homepage + 9 Inner Pages in Figma',
    price: '$800',
    features: [
      'Unique Web Homepage + 9 Inner Pages Design in Figma (Desktop + Mobile) | No Coding | Discuss More',
      '10 pages',
      'Responsive design',
      'Source file',
      'Unlimited Revisions',
      '10-day delivery',
    ],
  },
];

export default function UiUxServices() { // Renamed component for clarity

  usePageTitle("Ui/Ux");

  const [isPackVisible, setPackVisible] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('Figma Landing Page Design'); // Default to the first package's actual name

  const togglePackVisibility = () => setPackVisible((prev) => !prev);
  const currentPackage = uiUxPackages.find((pkg) => pkg.name === selectedPackage);

  return (
    <div className="px-6 py-4 flex flex-col gap-8 items-center justify-center w-full pt-20">
      <motion.h1
        initial={{ x: 100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold"
      >
        Design Your WebSite
      </motion.h1>

      <p className="text-center max-w-3xl">
        We design websites that don’t just look good — they work beautifully. Our goal is to create user-friendly, visually appealing websites that reflect your brand and engage your audience.
        Whether you're a small business, a startup, or a personal brand, we design responsive websites that look great on all devices. We focus on clean layouts, easy navigation, and modern design trends to help your visitors find what they need — fast.
      </p>

      <div className="features flex flex-col lg:flex-row gap-16 mt-4">
        {/* What's included */}
        <motion.ul initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="bg-gray-300 p-8 rounded-xl flex flex-col gap-3 w-[400px]">
          <p className="font-bold">What’s included in our web design services:</p>
          <li><p>Custom layout and visual design</p></li>
          <li><p>User experience (UX) and user interface (UI) focus</p></li>
          <li><p>Branding and color consistency</p></li>
          <li><p>SEO-friendly structure</p></li>
          <li><p>Mobile-friendly (responsive) design</p></li>
        </motion.ul>

        {/* Our Key Features */}
        <motion.ul initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="bg-gray-300 p-8 rounded-xl flex flex-col gap-3 w-[400px]">
          <p className="font-bold">Our Key Features:</p>
          <li><p>Premium Designs & Luxury Themes</p></li>
          <li><p>Elegant Look</p></li>
          <li><p>Premium Features</p></li>
          <li><p>Custom High End Colors</p></li>
          <li><p>24/7 customer care and much more</p></li>
        </motion.ul>
      </div>

      {/* Removed the extra paragraph here as it was not present in the source UiUx.jsx */}

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
          <h1 className="text-2xl font-bold">Web Design package:</h1> {/* Updated heading */}

          <div className="md:w-[526px] w-[405px] rounded-xl overflow-hidden border border-gray-300">
            <div className="bg-gray-300 flex">
              {uiUxPackages.map((pkg) => ( // Use uiUxPackages
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