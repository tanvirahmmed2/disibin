import React from 'react'
import { Link } from 'react-router-dom'
import {motion} from "motion/react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSwatchbook, faCode, faPeopleArrows, faDatabase, faLaptopCode, faTicket } from '@fortawesome/free-solid-svg-icons'


export default function WebDev(props) {
    return (

        <div className='flex flex-col items-center gap-8 justify-center w-full min-h-[95vh] px-4 py-8 pt-20'>
            <h1 className='text-center w-full'><strong className='font-bold text-2xl text-teal-700 '>{props.title}</strong>, provide end-to-end services that blend strategy, creativity, and technology to help businesses thrive in the modern digital landscape.</h1>
            <motion.h1 initial={{x:100}} whileInView={{x:0}} transition={{duration:0.5}} className='font-bold text-2xl'>Our Web Development Services:</motion.h1>
            <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-12 text-black'>
                <motion.div initial={{opacity:0, scale:0.8}} whileInView={{opacity:1, scale:1}} transition={{duration:0.5}} className='flex flex-col gap-4 items-center justify-center w-[250px] h-[300px] bg-teal-300 group hover:bg-teal-200 hover:shadow-2xl hover:scale-110  cursor-pointer px-2 py-2 rounded-xl relative'>
                    <FontAwesomeIcon icon={faSwatchbook} className='text-4xl mb-2 text-orange-700' />
                    <h2 className='font-semibold text-lg mb-1'>Ui/Ux Design</h2>
                    <p className='text-center text-sm text-black'>
                        Crafting beautiful, intuitive, and user-friendly digital experiences through thoughtful interface and experience design
                    </p>

                    <Link to="/ui-ux-dev" className='absolute bottom-3 text-white font-semibold text-sm hidden group-hover:block'>Read More</Link>
                </motion.div>
                <motion.div initial={{opacity:0, scale:0.8}} whileInView={{opacity:1, scale:1}} transition={{duration:0.5}} className='flex flex-col gap-4 items-center justify-center w-[250px] h-[300px] bg-teal-300 group hover:bg-teal-200 hover:shadow-2xl hover:scale-110 cursor-pointer px-2 py-2 rounded-xl relative'>
                    <FontAwesomeIcon icon={faCode} className='text-4xl mb-2 text-orange-700' />

                    <h2 className='font-semibold text-lg mb-1'>Front-End Development</h2>
                    <p className='text-center text-sm text-black'>
                        Building fast, responsive, and interactive websites using modern technologies to bring designs to life in the browser
                    </p>
                    <Link to="/front-end-dev" className='absolute bottom-3 text-white font-semibold text-sm hidden group-hover:block'>Read More</Link>
                </motion.div>
                <motion.div initial={{opacity:0, scale:0.8}} whileInView={{opacity:1, scale:1}} transition={{duration:0.5}} className='flex flex-col gap-4 items-center justify-center w-[250px] h-[300px] bg-teal-300 group hover:bg-teal-200 hover:shadow-2xl hover:scale-110 cursor-pointer px-2 py-2 rounded-xl relative'>
                    <FontAwesomeIcon icon={faDatabase} className='text-4xl mb-2 text-orange-700' />
                    <h2 className='font-semibold text-lg mb-1'>Back-End Development</h2>
                    <p className='text-center text-sm text-black'>
                        Developing the behind-the-scenes logic, databases, and server-side functionality that power your website or app
                    </p>
                    <Link to="/back-end-dev" className='absolute bottom-3 text-white font-semibold text-sm hidden group-hover:block'>Read More</Link>
                </motion.div>
                <motion.div initial={{opacity:0, scale:0.8}} whileInView={{opacity:1, scale:1}} transition={{duration:0.5}} className='flex flex-col gap-4 items-center justify-center w-[250px] h-[300px] bg-teal-300 group hover:bg-teal-200 hover:shadow-2xl hover:scale-110 cursor-pointer px-2 py-2 rounded-xl relative'>
                    <FontAwesomeIcon icon={faLaptopCode} className='text-4xl mb-2 text-orange-700' />
                    <h2 className='font-semibold text-lg mb-1'>Full-Stack Development</h2>
                    <p className='text-center text-sm text-black'>
                        Delivering complete web solutions by combining front-end and back-end development into a seamless, scalable experience
                    </p>
                    <Link to="/full-stack-dev" className='absolute bottom-3 text-white font-semibold text-sm hidden group-hover:block'>Read More</Link>
                </motion.div>
                <motion.div initial={{opacity:0, scale:0.8}} whileInView={{opacity:1, scale:1}} transition={{duration:0.5}} className='flex flex-col gap-4 items-center justify-center w-[250px] h-[300px] bg-teal-300 group hover:bg-teal-200 hover:shadow-2xl hover:scale-110 cursor-pointer px-2 py-2 rounded-xl relative'>
                    <FontAwesomeIcon icon={faTicket} className='text-4xl mb-2 text-orange-700' />
                    <h2 className='font-semibold text-lg mb-1'>Web App</h2>
                    <p className='text-center text-sm text-black'>
                        A fast, secure, and user-friendly web app designed to boost productivity and streamline tasks from any device.
                    </p>
                    <Link to="/web-app" className='absolute bottom-3 text-white font-semibold text-sm hidden group-hover:block'>Read More</Link>
                </motion.div>
                <motion.div initial={{opacity:0, scale:0.8}} whileInView={{opacity:1, scale:1}} transition={{duration:0.5}} className='flex flex-col gap-4 items-center justify-center w-[250px] h-[300px] bg-teal-300 group hover:bg-teal-200 hover:shadow-2xl hover:scale-110 cursor-pointer px-2 py-2 rounded-xl relative'>
                    <FontAwesomeIcon icon={faPeopleArrows} className='text-4xl mb-2 text-orange-700' />

                    <h2 className='font-semibold text-lg mb-1'>Consultation</h2>
                    <p className='text-center text-sm text-black'>
                        Let’s talk! Get expert advice, explore your ideas, and find the best digital solution for your business—no cost, no pressure
                    </p>
                    <a href="mailto:disibin@gmail.com" className='absolute bottom-3 text-white font-semibold text-sm hidden group-hover:block'>Mail Us</a>
                </motion.div>
            </div>
        </div>

    )
}
