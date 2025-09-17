import React, { useContext } from 'react'
import { Link } from 'react-router-dom'

import { CiMenuFries } from "react-icons/ci";
import { RxCross1 } from "react-icons/rx";

import { CreateContext } from '../component/Context/CreateContext'

const Sidebar = () => {
    const { sidebar, setSidebar } = useContext(CreateContext)
    return (
    <section className={`w-auto h-screen flex flex-col items-start px-4 justify-between py- 16 pb-10 ${sidebar? 'translate-x-0': '-translate-x-full'} transform transition-transform duration-500 ease-in-out fixed top-0 left-0 backdrop-blur-2xl z-50`}>
            <div className={`w-auto flex pb-4 flex-col items-start justify-center`}>
                <a href="/" className='text-3xl font-semibold my-7'>Disibin</a>
                <Link className=' flex items-center justify-center px-2 p-1' onClick={() => setSidebar(!sidebar)} to="/">Home</Link>
                <Link className=' flex items-center justify-center px-2 p-1' onClick={() => setSidebar(!sidebar)} to='/services'>Services</Link>
                <Link className=' flex items-center justify-center px-2 p-1' onClick={() => setSidebar(!sidebar)} to='/projects'>Projects</Link>
                <Link className=' flex items-center justify-center px-2 p-1' onClick={() => setSidebar(!sidebar)} to="/about">About</Link>
                <Link className=' flex items-center justify-center px-2 p-1' onClick={() => setSidebar(!sidebar)} to="/contact">Contact</Link>
                <Link className=' flex items-center justify-center px-2 p-1' onClick={() => setSidebar(!sidebar)} to="/cart">Cart</Link>
                <Link className=' flex items-center justify-center px-2 p-1' onClick={() => setSidebar(!sidebar)} to="/signup">Sign Up</Link>
                <Link className=' flex items-center justify-center px-2 p-1' onClick={() => setSidebar(!sidebar)} to="/signin">Sign In</Link>

            </div>
            <div className='w-full flex flex-col items-start'>
                <p className={`${!sidebar ? "flex" : "hidden"}  text-xl px-4 cursor-pointer`} onClick={() => setSidebar(!sidebar)}><CiMenuFries /></p>
                <p className={`${sidebar ? "flex" : "hidden"}   text-xl px-4 cursor-pointer`} onClick={() => setSidebar(!sidebar)}><RxCross1 /></p>
            </div>

        </section>
    )
}

export default Sidebar
