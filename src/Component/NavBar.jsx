import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons';

export default function NavBar(props) {


    return (
        <nav className=' shadow-xl text-teal-700 h-12 px-4 py-2 flex  flex-row items-center justify-between w-full z-999 relative'>

            <Link to="/">
                <h1 className=' text-2xl font-bold'>{props.title}</h1>
            </Link>
            <Link to='/menubar' className='h-12 px-4 cursor-pointer w-16 flex items-center justify-center md:hidden' ><FontAwesomeIcon icon={faBars} /></Link>

            <div className=' md:flex hidden mr-2 flex-row h-12 gap-4 items-center justify-center font-medium text-l'>
                <Link to="/" className='w-28 h-12 flex items-center justify-center '>Home</Link>
                <div className={`main-wrapper relative group`}>

                    <p className='w-28 h-12 flex items-center justify-center cursor-pointer ' >Service </p>

                    <div className={`absolute group-hover:block hidden `}>
                        <Link to="/ui-ux-dev" className='w-36 h-10 flex items-center justify-tart  hover:scale-110   hover:text-red-600      rounded-xl px-4'>Ui-Ux Design</Link>
                        <Link to="/front-end-dev" className='w-36 h-10 flex items-center justify-tart  hover:scale-110   hover:text-red-600  rounded-xl px-4'>Front-End Dev</Link>
                        <Link to="/back-end-dev" className='w-36 h-10 flex items-center justify-start  hover:scale-110  hover:text-red-600   rounded-xl px-4'>Back-End Dev</Link>
                        <Link to="/full-stack-dev" className='w-36 h-10 flex items-center justify-start hover:scale-110  hover:text-red-600  rounded-xl px-4'>Full-Stack Dev</Link>
                        <Link to="/branding" className='w-36 h-10 flex items-center justify-start  hover:scale-110  hover:text-red-600       rounded-xl px-4'>Branding</Link>


                        <div className={`main-wrapper relative group/item`}>
                            <p className='w-36 h-10 flex items-center justify-tart     hover:text-red-600      rounded-xl px-4 select-none cursor-pointer'>Online Maker</p>
                            <div className=' abosulte group-hover/item:block hidden '>
                                <Link to='/id-card' className='w-36 h-10 flex items-center justify-tart  hover:scale-110   hover:text-red-600      rounded-xl px-6'>ID Card</Link>
                                
                            </div>
                        </div>
                        
                              

                    </div>
                </div>
                <Link to="/help" className='w-28 h-12 flex items-center justify-center '>Help</Link>
                <Link to="/about" className='w-28 h-12 flex items-center justify-center '>About Us</Link>
                <Link to="/login" className='w-28 h-12 flex items-center justify-center '>Login</Link>
            </div>
        </nav>
    )
}
