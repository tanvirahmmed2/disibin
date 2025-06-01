import React, { useState } from 'react';
import { motion } from 'framer-motion';

import usePageTitle from '../usePageTitle'

const productPackages = [
  {
    name: 'Basic',
    price: '$100',
    features: [
      '1 product concept',
      '3D render + high-res mockups',
      'Basic usability considerations',
      'Commercial use',
      '5-day delivery',
    ],
  },
  {
    name: 'Standard',
    price: '$250',
    features: [
      '2 product concepts with variations',
      '3D model + exploded view',
      'Product usage visualization',
      'Basic user testing insights',
      'Editable source files',
      '7-day delivery',
    ],
  },
  {
    name: 'Premium',
    price: '$500',
    features: [
      '3+ advanced product concepts',
      'Detailed 3D CAD + photorealistic rendering',
      'User research summary & persona mapping',
      'UI/UX interface design (if digital product)',
      'Manufacturing-ready file exports',
      '14-day delivery',
    ],
  },
];

export default function ProductDesign() {

  usePageTitle("ProductDesign");


  const [isPackVisible, setPackVisible] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('Basic');

  const togglePackVisibility = () => setPackVisible((prev) => !prev);
  const currentPackage = productPackages.find((pkg) => pkg.name === selectedPackage);

  return (
    <div className="px-6 py-4 flex flex-col gap-8 items-center justify-center w-full pt-20">
      <motion.h1
        initial={{ x: 100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold"
      >
        Product Design That Delivers
      </motion.h1>

      <p className="text-center max-w-3xl">
        We bring ideas to life through thoughtful, functional, and visually compelling product design. From sketches to renders, we craft product concepts that are user-centered, manufacturable, and market-ready.
      </p>

      <div className="features flex flex-col lg:flex-row gap-16 mt-4">
        {/* What We Design */}
        <motion.ul initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="bg-gray-300 p-8 rounded-xl flex flex-col gap-3 w-[400px]">
          <h3 className="font-bold">What We Design</h3>
          <li>Consumer electronics</li>
          <li>Wearables & accessories</li>
          <li>Home & lifestyle products</li>
          <li>Packaging and enclosures</li>
          <li>3D-printed items</li>
          <li>App-connected products</li>
        </motion.ul>

        {/* How It Helps */}
        <motion.ul initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="bg-gray-300 p-8 rounded-xl flex flex-col gap-3 w-[400px]">
          <h3 className="font-bold">Why It Matters</h3>
          <li>Better user experience</li>
          <li>Improved market appeal</li>
          <li>Optimized for production</li>
          <li>Investor-ready presentations</li>
          <li>Supports crowdfunding or MVP</li>
          <li>Gives form to your startup idea</li>
        </motion.ul>
      </div>

      <p className="max-w-2xl text-center">
        Good product design isn’t just beautiful — it’s intuitive, purposeful, and drives business. Let’s build something that stands out.
      </p>

      <div className="flex md:flex-row flex-col gap-4">
        <a className="px-4 py-2 bg-gray-300 rounded-xl cursor-pointer hover:bg-teal-200" href="mailto:disibin@gmail.com">
          Hire Designer
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
          <h1 className="text-2xl font-bold">Product Design Packages:</h1>

          <div className="md:w-[526px] w-[405px] rounded-xl overflow-hidden border border-gray-300">
            <div className="bg-gray-300 flex">
              {productPackages.map((pkg) => (
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
