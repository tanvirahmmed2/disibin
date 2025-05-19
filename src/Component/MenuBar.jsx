import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function MenuBar() {
    let [Service, setService]= useState('hidden');
    const servicehandle=()=>{
        setService(Service=='hidden'? 'flex': 'hidden');
    }
    let backbutton= useNavigate();
    const backbuttonhandle=()=>{
        backbutton(-1)
    }
    return (
        <div className={`flex items-center justify-center w-full h-[95vh] bg-teal-600`}>
            <div className='flex flex-col items-center justify-between py-4 text-white w-[400px]  h-[95vh] bg-teal-800 relative'>
                <div className='w-[200px]'>
                    <Link to='/'>Home</Link>
                    <div className={`main-wrapper relative `}>

                        <p className='cursor-pointer w-full text-start ' onClick={servicehandle} >Service</p>

                        <div className={` w-full ${Service} flex-col`}>
                            <Link to="/ui-ux-dev" className='  w-full     text-start hover:scale-110   hover:text-red-600      rounded-xl px-4'>Ui-Ux Design</Link>
                            <Link to="/front-end-dev" className='w-full  text-start hover:scale-110   hover:text-red-600  rounded-xl px-4'>Front-End Dev</Link>
                            <Link to="/back-end-dev" className='w-full  text-start hover:scale-110  hover:text-red-600   rounded-xl px-4'>Back-End Dev</Link>
                            <Link to="/full-stack-dev" className='w-full text-start hover:scale-110  hover:text-red-600  rounded-xl px-4'>Full-Stack Dev</Link>
                            <Link to="/branding" className='  w-full    text-start    hover:scale-110  hover:text-red-600       rounded-xl px-4'>Branding</Link>

                        </div>
                    </div>
                    
                </div>

                <div className='flex w-[200px] h-auto flex-col items-center justify-center'>
                    <Link to="/help" className=' w-full  text-start '>Help</Link>
                    <Link to="/about" className=' w-full  text-start  '>About Us</Link>
                    <Link to="/login" className='w-full  text-start  '>Login</Link>
                </div>
                <FontAwesomeIcon icon={faXmark} className='absolute right-8 top-4 cursor-pointer text-xl' onClick={backbuttonhandle}/>

            </div>


        </div>
    )
}
