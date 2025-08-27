import React from 'react'
import {motion} from "framer-motion"
import { Link } from 'react-router-dom'
import UsePageTitle from '../component/UsePageTitle'

const Signin = () => {
  UsePageTitle("SignIn")
  return (
    <section className='w-full  h-screen flex items-center justify-center'>
      <motion.div initial={{ opacity:0, x:-30}} whileInView={{ opacity:1, x:0}} transition={{duration:0.5}} className='p-6 gap-6 rounded-lg bg-white/5 w-full m-6 lg:mx-48 flex flex-col lg:flex-row items-center justify-center'>
          <div className='w-full text-lg gap-2 font-semibold flex flex-col items-center justify-center'>
            <p>Welcome back to</p>
            <h1 className='text-7xl font-semibold'>Disibin</h1>
            <p>Sign in & access our premium services</p>
            <p>Stay tuned for latest jobs and offers</p>
            <Link to="/signup" className='text-red-500 text-base font-normal'>new user!</Link>
          </div>
          <div className='w-full flex flex-col items-center justify-center'>
            
            <form action="" className='w-full flex-col flex items-center justify-center gap-4'>
              <div className='w-full flex flex-col gap-2'>
                <label htmlFor="username">username</label>
                <input type="text" id='username' name='username' className='w-full p-1 px-2 rounded-lg bg-white/20 outline-none ' required/>
              </div>
              <div className='w-full flex flex-col gap-2'>
                <label htmlFor="password">password</label>
                <input type="text" id='password' name='password' className='w-full p-1 px-2 rounded-lg bg-white/20 outline-none ' required/>
              </div>
              <button type='submit' className='px-4 p-1 bg-white/5 rounded-lg'>sign in</button>
            </form>

          </div>
      </motion.div>
    </section>
  )
}

export default Signin
