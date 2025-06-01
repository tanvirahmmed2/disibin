import React, { useState } from 'react';
import { motion } from 'framer-motion';

const bookPackages = [
  {
    name: 'Basic',
    price: '$60',
    features: [
      'Cover design (front only)',
      'High-resolution PDF & JPG',
      '1 concept + 2 revisions',
      'Commercial use',
      '3-day delivery',
    ],
  },
  {
    name: 'Standard',
    price: '$150',
    features: [
      'Full cover design (front, back, spine)',
      'Paperback + ebook formats',
      '3 concepts + unlimited revisions',
      'Print-ready files (PDF, PNG)',
      'ISBN & barcode placement',
      '5-day delivery',
    ],
  },
  {
    name: 'Premium',
    price: '$300',
    features: [
      'Complete book layout (up to 200 pages)',
      'Professional typography & typesetting',
      'Full cover design + promotional graphics',
      'Print & digital formats (EPUB, MOBI, PDF)',
      'Branding and author logo (if needed)',
      '7–10 day delivery',
    ],
  },
];

export default function BookDesign() {
  const [isPackVisible, setPackVisible] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('Basic');

  const togglePackVisibility = () => setPackVisible((prev) => !prev);
  const currentPackage = bookPackages.find((pkg) => pkg.name === selectedPackage);

  return (
    <div className="px-6 py-4 flex flex-col gap-8 items-center justify-center w-full pt-20">
      <motion.h1
        initial={{ x: 100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold"
      >
        Book Cover & Layout Design
      </motion.h1>

      <p className="text-center max-w-3xl">
        A book’s design is its first impression. Whether you’re self-publishing or working with a publisher, we create compelling covers and elegant layouts that enhance readability, attract attention, and reflect your story’s essence.
      </p>

      <div className="features flex flex-col lg:flex-row gap-16 mt-4">
        {/* What We Offer */}
        <motion.ul initial={{opacity:0, scale:0.8}} whileInView={{opacity:1, scale:1}} transition={{duration:0.5}} className="bg-gray-300 p-8 rounded-xl flex flex-col gap-3 w-[400px]">
          <h3 className="font-bold">Design Services</h3>
          <li>Cover design (ebook & print)</li>
          <li>Interior formatting & layout</li>
          <li>Typography selection & styling</li>
          <li>Page numbering, headers, footers</li>
          <li>Print-ready and digital files</li>
          <li>Custom illustrations or graphics</li>
        </motion.ul>

        {/* Ideal For */}
        <motion.ul initial={{opacity:0, scale:0.8}} whileInView={{opacity:1, scale:1}} transition={{duration:0.5}} className="bg-gray-300 p-8 rounded-xl flex flex-col gap-3 w-[400px]">
          <h3 className="font-bold">Perfect For</h3>
          <li>Self-published authors</li>
          <li>Publishing houses</li>
          <li>Children’s books</li>
          <li>Novels, memoirs, non-fiction</li>
          <li>Poetry books and journals</li>
          <li>Workbooks and planners</li>
        </motion.ul>
      </div>

      <p className="max-w-2xl text-center">
        Let’s turn your manuscript into a beautiful book that readers will want to pick up and publishers will notice.
      </p>

      <div className="flex md:flex-row flex-col gap-4">
        <a className="px-4 py-2 bg-gray-300 rounded-xl cursor-pointer hover:bg-teal-200" href="mailto:disibin@gmail.com">
          Hire Book Designer
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
          <h1 className="text-2xl font-bold">Book Design Packages:</h1>

          <div className="md:w-[526px] w-[405px] rounded-xl overflow-hidden border border-gray-300">
            <div className="bg-gray-300 flex">
              {bookPackages.map((pkg) => (
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
