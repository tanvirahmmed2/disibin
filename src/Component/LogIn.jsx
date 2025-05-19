import React, { useState } from 'react'


export default function Signin() {
  let [Log, setLog] = useState("signin");
  const gotosignup = () => {
    setLog("signup")
  }
  const gotosignin = () => {
    setLog("signin")
  }

  return (
    <div className='w-full h-[90vh] flex items-center justify-center '>
      <div className='relative w-[500px]  h-[400px] rounded-3xl flex  border-solid border-2 overflow-hidden border-gray-200'>
        <div id='signindetails' className={` w-full h-[400px] flex flex-row items-center justify-between ${Log == "signin" ? "flex" : "hidden"} `}>
          
          <div className='flex flex-col items-center justify-center w-[250px] h-[400px] gap-4'>
            <input type="text" className='w-[200px]  border-1 outline-0 border-teal-700 px-2 py-1 shadow-2xl rounded-[5px]  ' placeholder='username or email' />
            <input type="text" className='w-[200px] border-1 outline-0 border-teal-700 px-2 py-1 shadow-2xl  rounded-[5px] ' placeholder='password' />
            <button className='bg-teal-700 mt-2 px-6 py-0.5   text-white cursor-pointer rounded-[5px]'>sign in</button>
          </div>

          <div className='flex flex-col items-center justify-center w-[250px] h-[400px] gap-2 bg-teal-700 text-white'>
            <h3>Welcome back to</h3>
            <h1 className='font-bold text-3xl'>DisiBin</h1>
            <h3>sign in and get back to</h3>
            <h3>your dashboard</h3>
            <p className='mt-4 cursor-pointer' onClick={gotosignup}>new here?</p>
          </div>


        </div>
        <div id='signupdetails' className={` w-full h-[400px] flex flex-row items-center justify-between ${Log == "signin" ? "hidden" : "flex"} `}>
          <div className='flex flex-col items-center justify-center w-[250px] h-[400px] gap-2 bg-teal-700 text-white'>
            <h3>Welcome to</h3>
            <h1 className='font-bold text-3xl'>DisiBin</h1>
            <h3>create new account</h3>
            <h3>to access all our services</h3>

            <p className='mt-4 cursor-pointer' onClick={gotosignin} >old user?</p>
          </div>
          <div className='flex flex-col items-center justify-center w-[250px] h-[400px] gap-4'>
            <input type="text" className='w-[200px] border-1 outline-0 border-teal-700 px-2 py-1 shadow-2xl   rounded-[5px] ' placeholder='first name' />
            <input type="text" className='w-[200px] border-1 outline-0 border-teal-700 px-2 py-1 shadow-2xl   rounded-[5px]' placeholder='sure name' />
            <input type="text" className='w-[200px] border-1 outline-0 border-teal-700 px-2 py-1 shadow-2xl   rounded-[5px]' placeholder='email' />
            <input type="date" className='w-[200px] border-1 outline-0 border-teal-700 px-2 py-1 shadow-2xl   rounded-[5px]' />
            <input type="text" className='w-[200px] border-1 outline-0 border-teal-700 px-2 py-1 shadow-2xl   rounded-[5px]' placeholder='password' />
            <button className='bg-teal-700 mt-2 px-6 py-0.5   text-white cursor-pointer rounded-[5px]'>sign up</button>

          </div>


        </div>

      </div>

    </div>
  )
}
