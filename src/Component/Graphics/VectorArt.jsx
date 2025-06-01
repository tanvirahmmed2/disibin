import React, { useState } from 'react';
import { motion } from 'framer-motion';

import usePageTitle from '../usePageTitle'

const vectorPackages = [
  {
    name: 'Basic',
    price: '$30',
    features: [
      '1 vector illustration',
      'High-resolution PNG & JPG files',
      'Basic background',
      'Commercial use',
      '3-day delivery',
    ],
  },
  {
    name: 'Standard',
    price: '$80',
    features: [
      '3 vector illustrations',
      'Source file (AI, SVG, EPS)',
      'Detailed background',
      'Full copyright transfer',
      'Unlimited revisions',
      '5-day delivery',
    ],
  },
  {
    name: 'Premium',
    price: '$150',
    features: [
      '5+ custom vector illustrations',
      'Complete scene design',
      'All file formats (AI, SVG, PDF, PNG)',
      'Includes characters, icons, and objects',
      'Storyboard or concept included',
      '7-day delivery',
    ],
  },
];

export default function VectorArt() {


  usePageTitle("VectorArt");

  const [isPackVisible, setPackVisible] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('Basic');

  const togglePackVisibility = () => setPackVisible((prev) => !prev);
  const currentPackage = vectorPackages.find((pkg) => pkg.name === selectedPackage);

  return (
    <div className="px-6 py-4 flex flex-col gap-8 items-center justify-center w-full pt-20">
      <motion.h1
        initial={{ x: 100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold"
      >
        Custom Vector Art & Illustrations
      </motion.h1>

      <p className="text-center max-w-3xl">
        Whether you need unique characters, infographics, custom icons, or scene illustrations, we deliver high-quality vector artwork that fits your vision. Our vector designs are scalable, editable, and perfect for digital, print, animation, and branding.
      </p>

      <div className="features flex flex-col lg:flex-row gap-16 mt-4">
        {/* Illustration Design */}
        <motion.ul initial={{opacity:0, scale:0.8}} whileInView={{opacity:1, scale:1}} transition={{duration:0.5}} className="bg-gray-300 p-8 rounded-xl flex flex-col gap-3 w-[400px]">
          <h3 className="font-bold">What We Offer</h3>
          <li>Custom characters and mascots</li>
          <li>Flat, isometric, and 3D styles</li>
          <li>Infographics and icons</li>
          <li>Backgrounds and scenery</li>
          <li>Commercial-use ready files</li>
          <li>Unlimited revisions on Standard & Premium</li>
        </motion.ul>

        {/* Application Areas */}
        <motion.ul initial={{opacity:0, scale:0.8}} whileInView={{opacity:1, scale:1}} transition={{duration:0.5}} className="bg-gray-300 p-8 rounded-xl flex flex-col gap-3 w-[400px]">
          <h3 className="font-bold">Where You Can Use It</h3>
          <li>Social media posts & stories</li>
          <li>Marketing & presentation materials</li>
          <li>Explainer videos</li>
          <li>Web & mobile apps</li>
          <li>Print products (stickers, posters, apparel)</li>
          <li>Brand mascots & icons</li>
        </motion.ul>
      </div>

      <p className="max-w-2xl text-center">
        Good design makes you memorable. Let’s bring your ideas to life with original vector artwork tailored to your goals.
      </p>

      <div className="flex md:flex-row flex-col gap-4">
        <a className="px-4 py-2 bg-gray-300 rounded-xl cursor-pointer hover:bg-teal-200" href="mailto:disibin@gmail.com">
          Hire Illustrator
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
          <h1 className="text-2xl font-bold">Vector Art Packages:</h1>

          <div className="md:w-[526px] w-[405px] rounded-xl overflow-hidden border border-gray-300">
            <div className="bg-gray-300 flex">
              {vectorPackages.map((pkg) => (
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
