import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CiMenuFries } from "react-icons/ci";
import { RxCross1 } from "react-icons/rx";



const Navbar = () => {

  const [menu, setMenu]= useState(false)
  const handlemenu=()=>{
    setMenu(!menu)
  }
  return (
    <section className='w-full h-auto fixed bg-black/10 text-white backdrop-blur-lg shadow-2xl top-0 z-50'>

      <nav className='w-full h-16 backdrop-blur-lg flex flex-row items-center justify-between lg:justify-around px-6'>
        <a href="/" className='text-3xl font-semibold'>Disibin</a>

        <div className='w-auto hidden md:flex flex-row h-16 items-center justify-center  font-semibold'>
          <Link className='h-16 flex items-center justify-center hover:border-b-2 px-4' to="/">Home</Link>
          <Link className='h-16 flex items-center justify-center hover:border-b-2 px-4' to='/services'>Services</Link>
          <Link className='h-16 flex items-center justify-center hover:border-b-2 px-4' to='/projects'>Projects</Link>
          <Link className='h-16 flex items-center justify-center hover:border-b-2 px-4' to="/about">About</Link>
          <Link className='h-16 flex items-center justify-center hover:border-b-2 px-4' to="/contact">Contact</Link>
          <Link className='h-10 flex items-center justify-center px-4 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-lg ' to="/signup">SignUp</Link>

        </div>
        <div onClick={handlemenu} className='h-16 cursor-pointer flex md:hidden items-center justify-center hover:border-b-2 px-6'>
          <p className={`${!menu? "flex": "hidden"}`}><CiMenuFries /></p>
          <p className={`${menu? "flex": "hidden"}`}><RxCross1 /></p>
          
        </div>
      </nav>
      <div className={`w-full md:hidden ${menu? "flex" : "hidden"} pb-4 flex-col items-center justify-center`}>
        <Link className=' flex items-center justify-center p-2' to="/">Home</Link>
        <Link className=' flex items-center justify-center p-2' to='/services'>Services</Link>
        <Link className=' flex items-center justify-center p-2' to='/projects'>Projects</Link>
        <Link className=' flex items-center justify-center p-2' to="/about">About</Link>
        <Link className=' flex items-center justify-center p-2' to="/contact">Contact</Link>
        <Link className=' flex items-center justify-center p-2' to="/signup">Sign Up</Link>
        <Link className=' flex items-center justify-center p-2' to="/signin">Sign In</Link>

      </div>

    </section>
  )
}

export default Navbar
