import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faPeopleArrows, faRankingStar, faTimeline, faVectorSquare } from '@fortawesome/free-solid-svg-icons'
import { faProductHunt } from '@fortawesome/free-brands-svg-icons'

import usePageTitle from './usePageTitle'


function Graphics(props) {
  usePageTitle("Graphics");
  return (
    <div className='flex flex-col items-center gap-8 justify-center w-full min-h-[95vh] px-4 py-20'>
      <h1 className='text-center w-full'> <strong className='font-bold text-2xl text-teal-700'>{props.title} </strong>, specialized in transforming ideas into stunning visual experiences. Our graphic design services are crafted to not only look great but to communicate your brand’s story with clarity and impact. Whether you need eye-catching logos, compelling marketing materials, engaging social media graphics, or a complete brand identity, we bring creativity, precision, and purpose to every project. Let us help you stand out in a crowded market with design that connects and converts</h1>
      <motion.h1 initial={{ x: 100 }} whileInView={{ x: 0 }} transition={{ duration: 0.5 }} className='font-bold text-2xl'>Our Core Graphics Jobs:</motion.h1>



      <div className=' grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-12 text-black '>

        <motion.div initial={{opacity:0, scale:0.8}} whileInView={{opacity:1, scale:1}} transition={{duration:0.5}} className='group flex flex-col gap-4 items-center justify-center w-[250px] h-[300px]  text-white bg-orange-300 group hover:bg-teal-300 hover:shadow-2xl hover:rotate-z-2 cursor-pointer px-2 py-2 rounded-xl relative'>
          <FontAwesomeIcon icon={faRankingStar} className='text-4xl mb-2 text-black' />
          <h2 className='font-semibold text-lg mb-1'>Visual Brand Identity</h2>
          <p className='text-center text-sm text-gray-700'>
            A strong brand is your most valuable asset — let us help you craft it, grow it, and make it unforgettable.
          </p>
          <Link to="/branding" className='absolute bottom-3 font-semibold text-sm hidden group-hover:block'>Read More</Link>
        </motion.div>



        <motion.div initial={{opacity:0, scale:0.8}} whileInView={{opacity:1, scale:1}} transition={{duration:0.5}} className='flex flex-col gap-4 items-center justify-center w-[250px] h-[300px] text-white bg-orange-300 group hover:bg-teal-300 hover:shadow-2xl hover:rotate-z-2 cursor-pointer px-2 py-2 rounded-xl relative'>
          <FontAwesomeIcon icon={faTimeline} className='text-4xl mb-2 text-black' />
          <h2 className='font-semibold text-lg mb-1'>Marketing / Ads Design</h2>
          <p className='text-center text-sm text-gray-700'>
            Stand out with striking ad designs—custom graphics for digital and print that grab attention and drive results.
          </p>
          <Link to="/ads-design" className='absolute bottom-3 font-semibold text-sm hidden group-hover:block'>Read More</Link>

        </motion.div>


        <motion.div initial={{opacity:0, scale:0.8}} whileInView={{opacity:1, scale:1}} transition={{duration:0.5}} className='flex flex-col gap-4 items-center justify-center w-[250px] h-[300px] text-white bg-orange-300 group hover:bg-teal-300 hover:shadow-2xl hover:rotate-z-2 cursor-pointer px-2 py-2 rounded-xl relative'>
          <FontAwesomeIcon icon={faBook} className='text-4xl mb-2 text-black' />
          <h2 className='font-semibold text-lg mb-1'>Book Design</h2>
          <p className='text-center text-sm text-gray-700'>
            Professional publication design that brings your content to life—magazines, brochures, reports, and more, crafted for clarity and visual impact.
          </p>
          <Link to="/book-design" className='absolute bottom-3 font-semibold text-sm hidden group-hover:block'>Read More</Link>

        </motion.div>


        <motion.div initial={{opacity:0, scale:0.8}} whileInView={{opacity:1, scale:1}} transition={{duration:0.5}} className='flex flex-col gap-4 items-center justify-center w-[250px] h-[300px] text-white bg-orange-300 group hover:bg-teal-300 hover:shadow-2xl hover:rotate-z-2 cursor-pointer px-2 py-2 rounded-xl relative'>
          <FontAwesomeIcon icon={faProductHunt} className='text-4xl mb-2 text-black' />
          <h2 className='font-semibold text-lg mb-1'>Product Design</h2>
          <p className='text-center text-sm text-gray-700'>
            Innovative product design that blends form and function—turning ideas into user-friendly, market-ready solutions.
          </p>
          <Link to="/product-design" className='absolute bottom-3 font-semibold text-sm hidden group-hover:block'>Read More</Link>

        </motion.div>



        <motion.div initial={{opacity:0, scale:0.8}} whileInView={{opacity:1, scale:1}} transition={{duration:0.5}} className='flex flex-col gap-4 items-center justify-center w-[250px] h-[300px] text-white bg-orange-300 group hover:bg-teal-300 hover:shadow-2xl hover:rotate-z-2 cursor-pointer px-2 py-2 rounded-xl relative'>
          <FontAwesomeIcon icon={faVectorSquare} className='text-4xl mb-2 text-black' />
          <h2 className='font-semibold text-lg mb-1'>Vector Art</h2>
          <p className='text-center text-sm text-gray-700'>
            Crisp, scalable vector art for logos, illustrations, and custom designs—perfect for any size, any style.
          </p>

          <Link to="/vector-art" className='absolute bottom-3 font-semibold text-sm hidden group-hover:block'>Read More</Link>

        </motion.div>



        <motion.div initial={{opacity:0, scale:0.8}} whileInView={{opacity:1, scale:1}} transition={{duration:0.5}} className='group flex flex-col gap-4 items-center justify-center w-[250px] h-[300px] text-white bg-orange-300 group hover:bg-teal-300 hover:shadow-2xl hover:rotate-z-2  cursor-pointer px-2 py-2 rounded-xl relative'>
          <FontAwesomeIcon icon={faPeopleArrows} className='text-4xl mb-2 text-orange-700' />

          <h2 className='font-semibold text-lg mb-1'>Consultation</h2>
          <p className='text-center text-sm text-red-700'>
            Let’s talk! Get expert advice, explore your ideas, and find the best digital solution for your business—no cost, no pressure
          </p>
          <a href="mailto:disibin@gmail.com" className='absolute bottom-3 font-semibold text-sm hidden group-hover:block'>Mail Us</a>
        </motion.div>



      </div>
    </div>

  )
}

export default Graphics
