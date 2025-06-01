import React, { useState } from 'react';
import { motion } from 'framer-motion'; // Corrected import path for framer-motion


import usePageTitle from '../usePageTitle'

const brandingPackages = [
  {
    name: 'Basic',
    price: '$50',
    features: [
      '1 Logo design',
      'Color palette',
      'Typography guidelines',
      'Logo usage guidelines',
      'Mockup 3D',
      'Unlimited Revisions',
      '7-day delivery',
    ],
  },
  {
    name: 'Standard',
    price: '$150',
    features: [
      '2 HQ Logo',
      'Vector file',
      'Source file',
      '8 to 10 Pages professional brand guidelines',
      'Mockup 3D',
      'Includes logo design',
      'Logo usage guidelines',
      'Color palette',
      'Typography guidelines',
      '14-day delivery',
    ],
  },
  {
    name: 'Premium',
    price: '$280',
    features: [
      '3 creative logo',
      '4 stationary',
      'Social media kit',
      '28 to 30 pages premium brand guide',
      'Mockup 3D',
      'Includes logo design',
      'Logo usage guidelines',
      'Color palette',
      'Typography guidelines',
      'Brand book design',
      '21-day delivery',
    ],
  },
];

export default function BrandingServices() { // Renamed component for clarity


  usePageTitle("Branding");

  const [isPackVisible, setPackVisible] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('Basic');

  const togglePackVisibility = () => setPackVisible((prev) => !prev);
  const currentPackage = brandingPackages.find((pkg) => pkg.name === selectedPackage);

  return (
    <div className="px-6 py-4 flex flex-col gap-8 items-center justify-center w-full pt-20">
      <motion.h1
        initial={{ x: 100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold"
      >
        Create Your Brand Identity
      </motion.h1>

      <p className="text-center max-w-3xl">
        Your brand is more than just a logo — it’s the voice, style, and story that people remember. We'll help you build a strong, memorable brand identity and promote it effectively across digital and offline platforms. Whether you’re starting fresh or rebranding, we work with you to create a consistent, professional look and feel that connects with your audience, builds trust, and sets you apart from the competition.
      </p>

      <div className="features flex flex-col lg:flex-row gap-16 mt-4">
        {/* Brand Identity */}
        <motion.ul initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="bg-gray-300 p-8 rounded-xl flex flex-col gap-3 w-[400px]">
          <h3 className="font-bold">Brand Identity</h3>
          <p>We shape the visual and verbal elements of your brand so it speaks clearly and consistently across all platforms.</p>
          <li><p>Custom logo design</p></li>
          <li><p>Brand color palette and typography</p></li>
          <li><p>Brand guidelines/style guide</p></li>
          <li><p>Business card and stationery design</p></li>
          <li><p>Voice & tone development</p></li>
          <li><p>Taglines and brand messaging</p></li>
        </motion.ul>

        {/* Brand Promotion */}
        <motion.ul initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="bg-gray-300 p-8 rounded-xl flex flex-col gap-3 w-[400px]">
          <h3 className="font-bold">Brand Promotion</h3>
          <p>We help you take your brand to the world with strategic marketing and visibility tools that grow awareness and engagement.</p>
          <li><p>Social media branding and content design</p></li>
          <li><p>Digital marketing materials (banners, ads, thumbnails)</p></li>
          <li><p>Branded templates for posts, stories, and reels</p></li>
          <li><p>Promotional videos and product intros</p></li>
          <li><p>Print materials (flyers, brochures, posters)</p></li>
          <li><p>Event or campaign branding. Email and online ad designs</p></li>
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
          <h1 className="text-2xl font-bold">Brand Identity Packages:</h1> {/* Updated heading */}

          <div className="md:w-[526px] w-[405px] rounded-xl overflow-hidden border border-gray-300">
            <div className="bg-gray-300 flex">
              {brandingPackages.map((pkg) => ( // Use brandingPackages
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