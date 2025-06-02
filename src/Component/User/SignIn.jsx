
import { Link } from 'react-router-dom'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import usePageTitle from '../usePageTitle'


export default function SignIn() {

  usePageTitle("signin");

  const navigate = useNavigate();

  let [Log, setLog] = useState("signin");
  const gotosignup = () => {
    setLog("signup")
  }
  const gotosignin = () => {
    setLog("signin")
  }

  let [logdata, setLogdata] = useState({
    username: "",
    password: ""
  });

  const handlechangelogdata = (e) => {
    const { name, value } = e.target;
    setLogdata((prevData) => ({
      ...prevData,
      [name]: value
    }));
  }

  const handlelogin = (e) => {
    e.preventDefault();
    if (logdata.username== 'admin' && logdata.password == 'admin') {
      navigate('/dev-dash');
    }
    else{
      alert("invalid data")
    }
    console.log(logdata);
  }

  return (
    <div className='w-full h-[100vh] flex items-center justify-center pt-20'>
      <div className='relative w-[400px] md:w-[600px]  h-[400px] rounded-3xl flex  border-solid border-2 overflow-hidden border-gray-200'>
        <div id='signindetails' className={` w-full h-[400px] flex flex-row items-center justify-between ${Log == "signin" ? "flex" : "hidden"} `}>

          <form onSubmit={handlelogin} className='flex flex-col items-center justify-center w-[200px] md:w-[300px] h-[400px] gap-4'>
            <input value={logdata.username} onChange={handlechangelogdata} name='username' type="text" className='w-[150px] md:w-[200px]  border-1 outline-0 border-teal-700 px-2 py-1 shadow-2xl rounded-[5px]  ' placeholder='username or email' />
            <input value={logdata.password} onChange={handlechangelogdata} name='password' type="password" className='w-[150px] md:w-[200px] border-1 outline-0 border-teal-700 px-2 py-1 shadow-2xl  rounded-[5px] ' placeholder='password' />
            <button className='bg-teal-700 mt-2 px-6 py-0.5   text-white cursor-pointer rounded-[5px]'>sign in</button>
          </form>

          <div className='flex flex-col items-center justify-center w-[200px] md:w-[300px] h-[400px] gap-2 bg-teal-700 text-white'>
            <h3>Welcome back to</h3>
            <h1 className='font-bold text-3xl'>DisiBin</h1>
            <h3>sign in and get back to</h3>
            <h3>your dashboard</h3>
            <Link to="/signup" className='mt-4 cursor-pointer' onClick={gotosignup}>new here?</Link>
          </div>


        </div>
        

      </div>

    </div>
  )
}