'use client'
import React from 'react'
import { FaAndroid, FaCode, FaFigma, FaGamepad, FaPlane } from 'react-icons/fa';
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
        description: 'A comprehensive administrative dashboard to track sales metrics, inventory levels, and customer growth in real-time.',
        image: 'https://res.cloudinary.com/dv30hn53t/image/upload/v1770759358/pexels-the-ghazi-2152398165-32216281_ynh65r.jpg'
      },
      {
        id: 2,
        title: 'Product Sale',
        description: 'Optimized checkout flows and promotional tools designed to increase conversion rates and streamline transactions.',
        image: 'https://res.cloudinary.com/dv30hn53t/image/upload/v1770759360/pexels-yoda-497072362-20296280_hz5xi3.jpg'
      },
      {
        id: 3,
        title: 'Product Presentation',
        description: 'High-quality galleries and interactive displays that showcase products with detailed specifications and immersive visuals.',
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
        description: 'Structured curriculum hosting with support for video lessons, downloadable resources, and progress tracking for students.',
        image: 'https://res.cloudinary.com/dv30hn53t/image/upload/v1770759358/pexels-pixelpanda-1386402-2676888_fa3swu.jpg'
      },
      {
        id: 2,
        title: 'Secured Test',
        description: 'Advanced assessment engines featuring timed exams, randomized questioning, and anti-cheat mechanisms.',
        image: 'https://res.cloudinary.com/dv30hn53t/image/upload/v1770759359/pexels-yaroslav-shuraev-9489759_pdxcch.jpg'
      },
      {
        id: 3,
        title: 'E-book Gallery',
        description: 'A digital library for hosting textbooks, whitepapers, and guides with an integrated reader interface.',
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
        description: 'Global content distribution system capable of reaching millions of readers across multiple digital platforms simultaneously.',
        image: 'https://res.cloudinary.com/dv30hn53t/image/upload/v1770759356/pexels-alesustinau-6915386_zmhheu.jpg'
      },
      {
        id: 2,
        title: 'International Report',
        description: 'In-depth investigative journalism and reporting modules focusing on significant global events and trends.',
        image: 'https://res.cloudinary.com/dv30hn53t/image/upload/v1770759356/pexels-brett-sayles-2479946_tiegxz.jpg'
      },
      {
        id: 3,
        title: 'Home and Abroad Update',
        description: 'Real-time news feeds delivering breaking updates from local communities and international headlines.',
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
        description: 'Customized event logging and user interaction tracking tailored to specific business workflows.',
        image: 'https://res.cloudinary.com/dv30hn53t/image/upload/v1770759358/pexels-iefproductions-31530915_dqqap8.jpg'
      },
      {
        id: 2,
        title: 'Personal & Promotional',
        description: 'High-impact landing pages designed to build personal brands and drive specific marketing campaign results.',
        image: 'https://res.cloudinary.com/dv30hn53t/image/upload/v1770759358/pexels-tural-huseyn-799948724-19150764_dxytal.jpg'
      },
      {
        id: 3,
        title: 'Showcase',
        description: 'Creative portfolios and dynamic galleries to display professional work with modern design aesthetics.',
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
        description: 'Complex data visualization using interactive charts and graphs to turn raw numbers into actionable business insights.',
        image: 'https://res.cloudinary.com/dv30hn53t/image/upload/v1770760733/pexels-xt7core-11300427_xvwolt.jpg'
      },
      {
        id: 2,
        title: 'User Management',
        description: 'Robust authentication systems with role-based access control (RBAC) to manage team permissions securely.',
        image: 'https://res.cloudinary.com/dv30hn53t/image/upload/v1770760735/pexels-yankrukov-6817701_qrx6t1.jpg'
      },
      {
        id: 3,
        title: 'Cloud Integration',
        description: 'Seamless connectivity with major cloud providers to ensure data synchronization and automated backups.',
        image: 'https://res.cloudinary.com/dv30hn53t/image/upload/v1770760733/pexels-googledeepmind-18069157_pkxwt8.jpg'
      },
    ]
  },
];

const Service = () => {
  return (
    <div className='w-full flex flex-col items-center justify-center gap-12 py-8  bg-gray-50/30'>
      <div className="py-12 w-full">
        <div className="flex flex-col items-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-2">Our Core Services</h1>
          <div className="w-20 h-1.5 bg-teal-600 rounded-full"></div>
        </div>

        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-8">
          {servicesData.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group relative w-full h-72 flex flex-col items-center justify-center bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-teal-500/10 cursor-pointer transition-all duration-500 rounded-2xl p-8 gap-4 overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-teal-50 rounded-full transition-all duration-500 group-hover:bg-teal-600 group-hover:scale-[6] opacity-20 group-hover:opacity-5 z-0" />
              <div className="relative z-10 text-5xl mb-2 text-teal-600 transition-transform duration-500 group-hover:-translate-y-2">{service.icon}</div>
              <div className="relative z-10 flex flex-col items-center gap-2 text-center">
                <h2 className="text-xl font-bold text-gray-800 group-hover:text-teal-700 transition-colors">{service.title}</h2>
                <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-600">{service.description}</p>
              </div>
              <div className="relative z-10 w-12 h-1 bg-teal-700 rounded-full transition-all duration-500 group-hover:w-24"></div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className=" w-full flex flex-col gap-10 relative p-1">
        {customServices.map((service, idx) => (
          <div key={service.id}
            className="w-full overflow-hidden min-h-screen py-10 flex flex-col items-center justify-center bg-white sticky top-0">

            <div className=" w-full flex flex-col items-center justify-center gap-4 ">
              <h1 className='w-full text-center text-2xl font-semibold md:text-4xl'>{service.title}</h1>
              <div className="w-full flex flex-col md:flex-row items-center justify-center gap-1 p-2">
                {service.sections.map((section) => (
                  <motion.div initial={{ opacity: 0, scale:0.9 }} whileInView={{ opacity: 1 , scale:1}} transition={{ duration: 1 }} key={section.id} className="group w-full aspect-video overflow-hidden relative shadow border border-black/50 rounded-xl" >

                    <div className="relative aspect-video w-full overflow-hidden ">
                      <Image
                        src={section.image}
                        alt={section.title}
                        width={1000}
                        height={1000}
                        className="w-full aspect-video object-cover"
                      />
                    </div>

                    <div className="w-full absolute z-10 bottom-0 bg-white p-2">
                      <strong className="text-lg text-gray-800  block group-hover:text-teal-600 transition-colors font-bold">
                        {section.title}
                      </strong>
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                        {section.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="absolute h-screen -z-1 opacity-10 scale-125 w-full overflow-hidden ">
              <Image
                src={service.image}
                alt={service.title}
                width={1000}
                height={1000}
                className="w-full  h-screen object-cover"
              />
            </div>


          </div>
        ))}
      </div>
    </div>
  )
}

export default Service
