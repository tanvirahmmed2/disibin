import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { CiMenuFries } from "react-icons/ci";
import { RxCross1 } from "react-icons/rx";
import { CreateContext } from '../component/Context/CreateContext';



const Navbar = () => {

  const {sidebar,setSidebar}= useContext(CreateContext)
  return (
    <section className='w-full h-auto fixed bg-black/10 text-white backdrop-blur-lg shadow-2xl top-0 z-40'>

      <nav className='w-full h-16 backdrop-blur-lg flex flex-row items-center justify-between lg:justify-around px-6'>
        <a href="/" className='text-3xl font-semibold'>Disibin</a>

        <div className='w-auto hidden md:flex flex-row h-16 items-center justify-center  font-semibold'>
          <Link className='h-16 flex items-center justify-center hover:border-b-2 px-4' to="/">Home</Link>
          <Link className='h-16 flex items-center justify-center hover:border-b-2 px-4' to='/services'>Services</Link>
          <Link className='h-16 flex items-center justify-center hover:border-b-2 px-4' to='/projects'>Projects</Link>
          <Link className='h-16 flex items-center justify-center hover:border-b-2 px-4' to="/about">About</Link>
          <Link className='h-16 flex items-center justify-center hover:border-b-2 px-4' to="/cart">Cart</Link>
          <Link className='h-16 flex items-center justify-center hover:border-b-2 px-4' to="/contact">Contact</Link>
        </div>
        <div  className='h-16 cursor-pointer flex  items-center justify-center flex-row gap-4 px-6'>
          
          <Link className='h-7 flex items-center justify-center px-4 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-lg ' to="/signup">SignUp</Link>

          <p className={`${!sidebar? "flex": "hidden"}  text-xl px-4`} onClick={()=> setSidebar(!sidebar)}><CiMenuFries /></p>
          <p className={`${sidebar? "flex": "hidden"}   text-xl px-4`} onClick={()=> setSidebar(!sidebar)}><RxCross1 /></p>
          
        </div>
      </nav>
      

    </section>
  )
}

export default Navbar
