import React, { useState } from 'react';
import { motion } from 'framer-motion';

import usePageTitle from '../usePageTitle'

const adsPackages = [
  {
    name: 'Basic',
    price: '$40',
    features: [
      '2 static ad designs',
      'For Facebook / Instagram / Google',
      'High-resolution files (JPG, PNG)',
      '1 round of revisions',
      '3-day delivery',
    ],
  },
  {
    name: 'Standard',
    price: '$100',
    features: [
      '5 static ad designs + 1 animated ad (GIF/MP4)',
      'Multi-platform optimized sizes',
      'Editable source files (PSD or AI)',
      'Copy placement and CTA optimization',
      'Unlimited revisions',
      '5-day delivery',
    ],
  },
  {
    name: 'Premium',
    price: '$200',
    features: [
      '10+ custom ad creatives (static + animated)',
      'A/B variant designs for testing',
      'Platform-specific variations (meta, LinkedIn, Google)',
      'Advanced motion graphics (for stories, reels, etc.)',
      'Creative strategy suggestions',
      '7-day delivery',
    ],
  },
];

export default function AdsDesign() {


  usePageTitle("Ads Design");

  const [isPackVisible, setPackVisible] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('Basic');

  const togglePackVisibility = () => setPackVisible((prev) => !prev);
  const currentPackage = adsPackages.find((pkg) => pkg.name === selectedPackage);

  return (
    <div className="px-6 py-4 flex flex-col gap-8 items-center justify-center w-full pt-20">
      <motion.h1
        initial={{ x: 100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold"
      >
        High-Impact Ad Design Services
      </motion.h1>

      <p className="text-center max-w-3xl">
        Need ad creatives that actually convert? We design high-performing visuals tailored for Facebook, Instagram, LinkedIn, Google, and more. Static or animated — your ads will stand out, grab attention, and drive action.
      </p>

      <div className="features flex flex-col lg:flex-row gap-16 mt-4">
        {/* What’s Included */}
        <motion.ul initial={{opacity:0, scale:0.8}} whileInView={{opacity:1, scale:1}} transition={{duration:0.5}} className="bg-gray-300 p-8 rounded-xl flex flex-col gap-3 w-[400px]">
          <h3 className="font-bold">What You Get</h3>
          <li>Ad creatives for all platforms</li>
          <li>Static & animated formats</li>
          <li>Mobile and desktop optimized</li>
          <li>Professional typography & layout</li>
          <li>Scroll-stopping visuals</li>
          <li>Performance-focused design</li>
        </motion.ul>

        {/* Ideal Use Cases */}
        <motion.ul initial={{opacity:0, scale:0.8}} whileInView={{opacity:1, scale:1}} transition={{duration:0.5}} className="bg-gray-300 p-8 rounded-xl flex flex-col gap-3 w-[400px]">
          <h3 className="font-bold">Great For</h3>
          <li>Social media campaigns</li>
          <li>Google Display Ads</li>
          <li>LinkedIn & Twitter promotions</li>
          <li>Story, Reel, and TikTok creatives</li>
          <li>Email marketing visuals</li>
          <li>Retargeting & product launches</li>
        </motion.ul>
      </div>

      <p className="max-w-2xl text-center">
        The right creative is the difference between getting ignored and getting clicked. Let’s build ad visuals that convert.
      </p>

      <div className="flex md:flex-row flex-col gap-4">
        <a className="px-4 py-2 bg-gray-300 rounded-xl cursor-pointer hover:bg-teal-200" href="mailto:disibin@gmail.com">
          Hire Ad Designer
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
          <h1 className="text-2xl font-bold">Ad Design Packages:</h1>

          <div className="md:w-[526px] w-[405px] rounded-xl overflow-hidden border border-gray-300">
            <div className="bg-gray-300 flex">
              {adsPackages.map((pkg) => (
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
