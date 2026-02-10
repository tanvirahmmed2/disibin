import Link from 'next/link'
import React from 'react'

import { FaFacebook, FaInstagram, FaPhone, FaTelegram, FaYoutube } from 'react-icons/fa'
import { CiMail } from 'react-icons/ci'


const Footer = () => {
  return (
    <footer className='w-full from-teal-900 to-teal-700 bg-linear-to-br text-white px-4 py-8 flex flex-col items-center justify-center gap-4'>


      <div className='w-full grid grid-cols-1 md:grid-cols-3 justify-items-center gap-4'>
        <div className='w-auto min-w-50 flex flex-col gap-1'>
          <p className='font-semibold'>Links</p>
          <div className='flex flex-col text-sm w-auto'>
            <Link href={'/projects'}>Projects</Link>
            <Link href={'/blogs'}>Blogs</Link>
            <Link href={'/pricing'}>Packages</Link>
            <Link href={'/login'}>Login</Link>
          </div>
        </div>
        <div className='w-auto min-w-50 flex flex-col gap-1'>
          <p className='font-semibold'>Policy</p>
          <div className='flex flex-col text-sm w-auto'>
            <Link href={'/'}>Privacy & Policy</Link>
            <Link href={'/'}>Payments</Link>
            <Link href={'/'}>Refund Policy</Link>
          </div>
        </div>
        <div className='w-auto min-w-50 flex flex-col gap-1'>
          <p className='font-semibold'>User Manual</p>
          <div className='flex flex-col text-sm w-auto'>
            <Link href={'/dashboard'}>Access</Link>
            <Link href={'/'}>Data</Link>
            <Link href={'/'}>Account</Link>
          </div>
        </div>
      </div>
      <div className='w-full max-w-3xl  grid grid-cols-1 md:grid-cols-2 justify-items-center gap-4'>
        <div className='w-auto flex flex-col gap-1'>
          <strong>Office</strong>
          <p>Rahmatpur</p>
          <p>Sadar, Mymensingh - 2200</p>
          <p>Bangladesh</p>
        </div>
        <div className='w-auto flex flex-col gap-1'>
          <strong>Hotline</strong>
          <Link className='' href="https://api.whatsapp.com/send/?phone=8801805003886&text&type=phone_number&app_absent=0">Dial: +8801805003886</Link>
          <p>Dial: +8801805003887</p>
        </div>
      </div>

      <div className='w-full grid grid-cols-1 md:grid-cols-2 justify-items-center gap-4 border-t pt-4'>
        <div className='w-auto min-w-50 flex flex-col gap-1 justify-center'>
          <Link href="/" className='text-2xl font-bold'>Disibin</Link>
          <p>Technology Development Studio</p>
        </div>
        <div className='w-auto min-w-50 flex flex-col gap-1 justify-center'>

          <div className='w-full flex flex-row items-center justify-center gap-4'>
            <Link className='px-2 p-2 bg-white/20 rounded-lg hover:scale-125 transition duration-500' href="https://www.facebook.com/disibin"><FaFacebook /></Link>
            <Link className='px-2 p-2 bg-white/20 rounded-lg hover:scale-125 transition duration-500' href="https://www.instagram.com/user.disibin/"><FaInstagram /></Link>
            <Link className='px-2 p-2 bg-white/20 rounded-lg hover:scale-125 transition duration-500' href="https://www.youtube.com/@Disibin"><FaYoutube /></Link>
            <Link className='px-2 p-2 bg-white/20 rounded-lg hover:scale-125 transition duration-500' href="mailto:disibin@gmail.com"><CiMail /></Link>
            <Link className='px-2 p-2 bg-white/20 rounded-lg hover:scale-125 transition duration-500' href="https://api.whatsapp.com/send/?phone=8801805003886&text&type=phone_number&app_absent=0"><FaPhone /></Link>
            <Link className='px-2 p-2 bg-white/20 rounded-lg hover:scale-125 transition duration-500' href="https://t.me/disibin"><FaTelegram /></Link>
          </div>
          <p className='text-center w-auto min-w-50'>2023 Disibin | All rights are reserved</p>
        </div>



      </div>
    </footer>
  )
}

export default Footer
