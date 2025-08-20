import React, { useEffect, useState } from 'react'
import { FaFacebook, FaInstagram, FaPhone, FaTelegram, FaYoutube } from 'react-icons/fa'
import { CiMail } from 'react-icons/ci'

const Footer = () => {
  const [year, setYear]= useState(new Date().getFullYear())
  useEffect(()=>{
    setYear(new Date().getFullYear())
  },[])
  return (
    <section className='w-full border-t-2'>
      <footer className='w-full h-auto flex flex-col md:flex-row bg-black/20 items-center justify-around p-6 gap-12'>
        <div>
          <a href="/" className='text-2xl font-bold'>Disibin</a>
          <p>Web & Graphics Development Studio</p>
        </div>
        <div className='w-auto h-auto flex flex-row items-center justify-center gap-4'>
          <a className='px-2 p-2 bg-white/20 rounded-lg hover:scale-125 transition duration-500' href="https://www.facebook.com/disibin"><FaFacebook/></a>
          <a className='px-2 p-2 bg-white/20 rounded-lg hover:scale-125 transition duration-500' href="https://www.instagram.com/user.disibin/"><FaInstagram/></a>
          <a className='px-2 p-2 bg-white/20 rounded-lg hover:scale-125 transition duration-500' href="https://www.youtube.com/@Disibin"><FaYoutube/></a>
          <a className='px-2 p-2 bg-white/20 rounded-lg hover:scale-125 transition duration-500' href="mailto:disibin@gmail.com"><CiMail/></a>
          <a className='px-2 p-2 bg-white/20 rounded-lg hover:scale-125 transition duration-500' href="tel:+8801987131369"><FaPhone/></a>
          <a className='px-2 p-2 bg-white/20 rounded-lg hover:scale-125 transition duration-500' href="https://t.me/disibin"><FaTelegram/></a>

        </div>
        <div>
          <p>{year} Disibin. All right reserved</p>
        </div>
      </footer>
    </section>
  )
}

export default Footer
