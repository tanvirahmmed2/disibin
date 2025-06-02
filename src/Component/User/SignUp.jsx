
import { Link } from 'react-router-dom'
import React from 'react'
import usePageTitle from '../usePageTitle'



export default function SignUp() {

  usePageTitle("Signup");

  return (
    <div className='w-full h-[100vh] flex items-center justify-center pt-20'>
      <div className='relative w-[400px] md:w-[600px]  h-[400px] rounded-3xl flex  border-solid border-2 overflow-hidden border-gray-200'>
        
        <div id='signupdetails' className={` w-full h-[400px] flex flex-row items-center justify-between  `}>
          <div className='flex flex-col items-center justify-center w-[200px] md:w-[300px] h-[400px] gap-2 bg-teal-700 text-white'>
            <h3>Welcome to</h3>
            <h1 className='font-bold text-3xl'>DisiBin</h1>
            <h3>create new account</h3>
            <h3>to access all our services</h3>

            <Link to="/signin" className='mt-4 cursor-pointer'>old user?</Link>
          </div>
          <div className='flex flex-col items-center justify-center w-[200px] md:w-[300px] h-[400px] gap-4'>
            <input type="text" className='w-[150px] md:w-[200px] border-1 outline-0 border-teal-700 px-2 py-1 shadow-2xl   rounded-[5px] ' placeholder='first name' />
            <input type="text" className='w-[150px] md:w-[200px] border-1 outline-0 border-teal-700 px-2 py-1 shadow-2xl   rounded-[5px]' placeholder='sure name' />
            <input type="text" className='w-[150px] md:w-[200px] border-1 outline-0 border-teal-700 px-2 py-1 shadow-2xl   rounded-[5px]' placeholder='email' />
            <input type="date" className='w-[150px] md:w-[200px] border-1 outline-0 border-teal-700 px-2 py-1 shadow-2xl   rounded-[5px]' />
            <input type="text" className='w-[150px] md:w-[200px] border-1 outline-0 border-teal-700 px-2 py-1 shadow-2xl   rounded-[5px]' placeholder='password' />
            <button className='bg-teal-700 mt-2 px-6 py-0.5   text-white cursor-pointer rounded-[5px]'>sign up</button>

          </div>


        </div>

      </div>

    </div>
  )
}