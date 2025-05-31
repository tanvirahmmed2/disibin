import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll } from 'motion/react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons';

export default function NavBar(props) {
    const { scrollYProgress } = useScroll()
    let [Menu, setMenu] = useState("hidden");
    const handlemenubar = () => {
        setMenu(Menu == "hidden" ? "flex" : "hidden")
    }


    return (
        <nav className=' bg-white shadow-xl  h-12  w-full z-999 fixed '>
            <motion.div style={{ scaleX: scrollYProgress }} className='origin-left absolute bg-teal-50 w-full h-12 -z-20'></motion.div>
            <div className='w-full text-teal-700 h-12 px-4 py-2 flex  flex-row items-center justify-between '>
                <Link to="/">
                    <h1 className=' text-2xl font-bold'>{props.title}</h1>
                </Link>
                <motion.p initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 5 }}
                    className='block md:hidden lg:block  text-red-600 italic'>beyond your dreams</motion.p>
                <div className='md:hidden flex items-center justify-center h-12 w-28 relative '>
                    <p onClick={handlemenubar} className='h-12 w-28 flex items-center justify-center cursor-pointer hover:border-b-2' ><FontAwesomeIcon icon={faBars} /></p>

                    <div className={`${Menu} flex-col justify-start absolute w-28 bg-teal-700 text-white md:hidden top-12`}>
                        <a href="/" className='w-28 h-10 flex items-center justify-center hover:border-b-2'>Home</a>

                        <div className={`main-wrapper block relative group/item4`}>
                            <Link to="/web-dev" className='w-36 h-10 flex items-center justify-start  hover:scale-110  hover:text-red-600       rounded-xl px-4'>Web Dev</Link>
                            <div className='bg-teal-700 group-hover/item4:block hidden absolute right-28 top-0'>
                                <Link to="/ui-ux-dev" className='w-36 h-10 flex items-center justify-tart  hover:scale-110   hover:text-red-600      rounded-xl px-4'>Ui-Ux Design</Link>
                                <Link to="/front-end-dev" className='w-36 h-10 flex items-center justify-tart  hover:scale-110   hover:text-red-600  rounded-xl px-4'>Front-End Dev</Link>
                                <Link to="/back-end-dev" className='w-36 h-10 flex items-center justify-start  hover:scale-110  hover:text-red-600   rounded-xl px-4'>Back-End Dev</Link>
                                <Link to="/full-stack-dev" className='w-36 h-10 flex items-center justify-start hover:scale-110  hover:text-red-600  rounded-xl px-4'>Full-Stack Dev</Link>
                                <Link to="/web-app" className='w-36 h-10 flex items-center justify-start hover:scale-110  hover:text-red-600  rounded-xl px-4'>Web App</Link>

                            </div>
                        </div>

                        <div className={`main-wrapper block relative group/item5`}>
                            <Link to="/graphics" className='w-36 h-10 flex items-center justify-start  hover:scale-110  hover:text-red-600       rounded-xl px-4'>Graphics</Link>
                            <div className='bg-teal-700 group-hover/item5:block hidden absolute right-28 top-0'>
                                <Link to="/branding" className='w-36 h-10 flex items-center justify-start  hover:scale-110  hover:text-red-600       rounded-xl px-4'>Brand Identity</Link>
                                <Link to='/ads-design' className='w-36 h-10 flex items-center justify-tart  hover:scale-110   hover:text-red-600      rounded-xl px-4'>Ads Design</Link>
                                <Link to='/book-design' className='w-36 h-10 flex items-center justify-tart  hover:scale-110   hover:text-red-600      rounded-xl px-4'>Book Design</Link>
                                <Link to='/product-design' className='w-36 h-10 flex items-center justify-tart  hover:scale-110   hover:text-red-600      rounded-xl px-4'>Product Design</Link>
                                <Link to='/vector-art' className='w-36 h-10 flex items-center justify-tart  hover:scale-110   hover:text-red-600      rounded-xl px-4'>Vector Art</Link>

                            </div>
                        </div>


                        <Link to="/help" className='w-28 h-12 flex items-center justify-center  hover:border-b-2'>Help</Link>
                        <Link to="/about" className='w-28 h-12 flex items-center justify-center hover:border-b-2'>About Us</Link>
                        <Link to="/login" className='w-28 h-12 flex items-center justify-center hover:border-b-2'>Login</Link>



                    </div>
                </div>



                <div className=' md:flex hidden mr-2 flex-row h-12 gap-4 items-center justify-center font-medium text-l'>
                    {/* <Link to="/" className='w-28 h-12 flex items-center justify-center '>Home</Link> */}
                    <a href="/" className='w-28 h-12 flex items-center justify-center hover:border-b-2'>Home</a>
                    <div className={`main-wrapper relative group`}>

                        <p className='w-28 h-12 flex items-center justify-center cursor-pointer hover:border-b-2' >Service </p>

                        <div className={`absolute group-hover:block hidden bg-gray-50 `}>
                            <div className={`main-wrapper block relative group/item`}>
                                <Link to="/web-dev" className='w-36 h-10 flex items-center justify-start  hover:scale-110  hover:text-red-600       rounded-xl px-4'>Web Dev</Link>
                                <div className='bg-white group-hover/item:block hidden absolute left-36 top-0'>
                                    <Link to="/ui-ux-dev" className='w-36 h-10 flex items-center justify-tart  hover:scale-110   hover:text-red-600      rounded-xl px-4'>Ui-Ux Design</Link>
                                    <Link to="/front-end-dev" className='w-36 h-10 flex items-center justify-tart  hover:scale-110   hover:text-red-600  rounded-xl px-4'>Front-End Dev</Link>
                                    <Link to="/back-end-dev" className='w-36 h-10 flex items-center justify-start  hover:scale-110  hover:text-red-600   rounded-xl px-4'>Back-End Dev</Link>
                                    <Link to="/full-stack-dev" className='w-36 h-10 flex items-center justify-start hover:scale-110  hover:text-red-600  rounded-xl px-4'>Full-Stack Dev</Link>
                                    <Link to="/web-app" className='w-36 h-10 flex items-center justify-start hover:scale-110  hover:text-red-600  rounded-xl px-4'>Web App</Link>

                                </div>
                            </div>

                            <div className={`main-wrapper block relative group/item2`}>
                                <Link to="/graphics" className='w-36 h-10 flex items-center justify-start  hover:scale-110  hover:text-red-600       rounded-xl px-4'>Graphics</Link>
                                <div className='bg-white group-hover/item2:block hidden absolute left-36 top-0'>
                                    <Link to="/branding" className='w-36 h-10 flex items-center justify-start  hover:scale-110  hover:text-red-600       rounded-xl px-4'>Brand Identity</Link>
                                    <Link to='/ads-design' className='w-36 h-10 flex items-center justify-tart  hover:scale-110   hover:text-red-600      rounded-xl px-4'>Ads Design</Link>
                                    <Link to='/book-design' className='w-36 h-10 flex items-center justify-tart  hover:scale-110   hover:text-red-600      rounded-xl px-4'>Book Design</Link>
                                    <Link to='/product-design' className='w-36 h-10 flex items-center justify-tart  hover:scale-110   hover:text-red-600      rounded-xl px-4'>Product Design</Link>
                                    <Link to='/vector-art' className='w-36 h-10 flex items-center justify-tart  hover:scale-110   hover:text-red-600      rounded-xl px-4'>Vector Art</Link>

                                </div>
                            </div>

                            <div className={`main-wrapper block relative group/item3`}>
                                <Link to="/generator" className='w-36 h-10 flex items-center justify-start  hover:scale-110  hover:text-red-600       rounded-xl px-4'>Generator</Link>
                                <div className='bg-white group-hover/item3:block hidden absolute left-36 top-0'>
                                    <Link to='/id-card' className='w-36 h-10 flex items-center justify-tart  hover:scale-110   hover:text-red-600      rounded-xl px-4'>ID Card</Link>


                                </div>
                            </div>




                        </div>
                    </div>
                    <Link to="/help" className='w-28 h-12 flex items-center justify-center  hover:border-b-2'>Help</Link>
                    <Link to="/about" className='w-28 h-12 flex items-center justify-center hover:border-b-2'>About Us</Link>
                    <Link to="/login" className='w-28 h-12 flex items-center justify-center hover:border-b-2'>Login</Link>
                </div>

            </div>

        </nav>
    )
}
