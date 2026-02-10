'use client'
import React from 'react'
import { FaAndroid, FaCode, FaFigma, FaGamepad, FaPlane } from 'react-icons/fa';
import { DiIllustrator } from "react-icons/di";
import { motion } from 'framer-motion';
import Image from 'next/image';

const servicesData = [
  {
    id: 1,
    title: "Website Design",
    description:
      "Clean, modern, and user-friendly UI/UX designs focused on usability, branding, and seamless experience across all devices.",
    icon: <FaFigma />,
  },
  {
    id: 2,
    title: "Website Development",
    description:
      "High-performance, scalable websites built with clean code, best practices, and modern technologies for speed and reliability.",
    icon: <FaCode />,
  },
  {
    id: 3,
    title: "Android App Development",
    description:
      "Custom Android applications designed for performance, smooth user experience, and long-term maintainability.",
    icon: <FaAndroid />,
  },
];

const customServices = [
  {
    id: 1,
    title: 'E-commerce Management',
    image: 'https://res.cloudinary.com/dv30hn53t/image/upload/v1770759360/pexels-yankrukov-7693229_cu52ux.jpg',
    sections: [
      {
        id: 1,
        title: 'Business Board',
        image: 'https://res.cloudinary.com/dv30hn53t/image/upload/v1770759358/pexels-the-ghazi-2152398165-32216281_ynh65r.jpg'
      },
      {
        id: 2,
        title: 'Product Sale',
        image: 'https://res.cloudinary.com/dv30hn53t/image/upload/v1770759360/pexels-yoda-497072362-20296280_hz5xi3.jpg'
      },
      {
        id: 3,
        title: 'Product Presentation',
        image: 'https://res.cloudinary.com/dv30hn53t/image/upload/v1770759355/pexels-lusaya-123013_fwsp22.jpg'
      },
    ]
  },
  {
    id: 2,
    title: 'Learning Management System',
    image: 'https://res.cloudinary.com/dv30hn53t/image/upload/v1770759360/pexels-zhu-yi-22208710-6602623_oyurjk.jpg',
    sections: [
      {
        id: 1,
        title: 'Perfect Courses',
        image: 'https://res.cloudinary.com/dv30hn53t/image/upload/v1770759358/pexels-pixelpanda-1386402-2676888_fa3swu.jpg'
      },
      {
        id: 2,
        title: 'Secured Test',
        image: 'https://res.cloudinary.com/dv30hn53t/image/upload/v1770759359/pexels-yaroslav-shuraev-9489759_pdxcch.jpg'
      },
      {
        id: 3,
        title: 'E-book Gallery',
        image: 'https://res.cloudinary.com/dv30hn53t/image/upload/v1770759357/pexels-pixabay-207732_o8gobc.jpg'
      },
    ]
  },
  {
    id: 3,
    title: 'NewsPaper',
    image: 'https://res.cloudinary.com/dv30hn53t/image/upload/v1770759358/pexels-efe-ersoy-393937500-15139464_thkcr8.jpg',
    sections: [
      {
        id: 1,
        title: 'World Wide Publication',
        image: 'https://res.cloudinary.com/dv30hn53t/image/upload/v1770759356/pexels-alesustinau-6915386_zmhheu.jpg'
      },
      {
        id: 2,
        title: 'International Report',
        image: 'https://res.cloudinary.com/dv30hn53t/image/upload/v1770759356/pexels-brett-sayles-2479946_tiegxz.jpg'
      },
      {
        id: 3,
        title: 'Home and Abroad Update',
        image: 'https://res.cloudinary.com/dv30hn53t/image/upload/v1770759357/pexels-naimish17-35990239_bgb7do.jpg'
      },
    ]
  },
  {
    id: 4,
    title: 'Custom Website',
    image: 'https://res.cloudinary.com/dv30hn53t/image/upload/v1770759359/pexels-yankrukov-8837715_gdqzas.jpg',
    sections: [
      {
        id: 1,
        title: 'Activities',
        image: 'https://res.cloudinary.com/dv30hn53t/image/upload/v1770759358/pexels-iefproductions-31530915_dqqap8.jpg'
      },
      {
        id: 2,
        title: 'Personal & Promotional',
        image: 'https://res.cloudinary.com/dv30hn53t/image/upload/v1770759358/pexels-tural-huseyn-799948724-19150764_dxytal.jpg'
      },
      {
        id: 3,
        title: 'Showcase',
        image: 'https://res.cloudinary.com/dv30hn53t/image/upload/v1770759358/pexels-squared-one-361277527-17210067_xdp2r3.jpg'
      },
    ]
  },
  {
    id: 5,
    title: 'SaaS Dashboard',
    image: 'https://res.cloudinary.com/dv30hn53t/image/upload/v1770760734/pexels-drew-williams-1285451-3098683_zyof7m.jpg',
    sections: [
      {
        id: 1,
        title: 'Data Analytics',
        image: 'https://res.cloudinary.com/dv30hn53t/image/upload/v1770760733/pexels-xt7core-11300427_xvwolt.jpg'
      },
      {
        id: 2,
        title: 'User Management',
        image: 'https://res.cloudinary.com/dv30hn53t/image/upload/v1770760735/pexels-yankrukov-6817701_qrx6t1.jpg'
      },
      {
        id: 3,
        title: 'Cloud Integration',
        image: 'https://res.cloudinary.com/dv30hn53t/image/upload/v1770760733/pexels-googledeepmind-18069157_pkxwt8.jpg'
      },
    ]
  },
]


const Service = () => {
  return (
    <div className='w-full   flex flex-col items-center justify-center gap-6 py-8 p-4'>
      <h1 className='text-2xl font-semibold text-center'>Our Core Services</h1>
      <div className='w-full  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center gap-8'>
        {
          servicesData && servicesData.map((service) => (
            <motion.div initial={{ opacity: 0, y: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }} key={service.id} className='w-full h-60 even:hover:-rotate-2 hover:rotate-2   flex flex-col items-center justify-center shadow-teal-700 shadow-sm hover:shadow-xl cursor-pointer transition ease-in-out duration-500 text-center rounded-lg p-5 gap-3'>
              <p className='text-3xl'>{service.icon}</p>
              <h1 className='font-semibold'>{service.title}</h1>
              <p className='opacity-70'>{service.description}</p>
              <span className='w-10 h-0.5 bg-teal-700'></span>
            </motion.div>
          ))
        }
      </div>
      {
        customServices.map((service) => (
          <div key={service.id} className='w-full flex flex-col items-center justify-center gap-4 '>
            <p className='text-2xl font-semibold text-center'>{service.title}</p>
            <div className='w-full flex flex-col items-center justify-center gap-4 md:flex-row'>
              <div className='w-full'>
                <Image src={`${service.image}`} alt='servie' width={1000} height={100} />
              </div>
              <div className='w-full flex flex-row'>
                {
                  service.sections.map((section) => (
                    <div key={section.id}>
                      <Image src={`${section.image}`} alt='section' width={1000} height={1000} />
                      <p>{section.title}</p>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        ))
      }

    </div>
  )
}

export default Service
