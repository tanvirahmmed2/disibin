import Link from 'next/link'
import React from 'react'
import { FaFacebook, FaInstagram, FaPhone, FaTelegram, FaYoutube } from 'react-icons/fa'
import { CiMail } from 'react-icons/ci'

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='w-full bg-emerald-600 text-white py-24'>
      <div className='container-custom'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20'>
          
          <div className='space-y-8'>
            <Link href="/" className='text-3xl font-black tracking-tighter'>Disibin<span className='text-emerald-500/50'>.</span></Link>
            <p className=' font-medium text-sm leading-relaxed max-w-xs'>
              Architecting high-performance digital ecosystems for forward-thinking enterprises globally.
            </p>
            <div className='flex items-center gap-4'>
                <Link href="https://www.facebook.com/disibin" className='w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-emerald-500 transition-all'><FaFacebook /></Link>
                <Link href="https://www.instagram.com/user.disibin/" className='w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-emerald-500 transition-all'><FaInstagram /></Link>
                <Link href="https://t.me/disibin" className='w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-emerald-500 transition-all'><FaTelegram /></Link>
            </div>
          </div>

          <div className='space-y-8'>
            <h4 className='text-[10px] font-black uppercase tracking-widest '>Core Navigation</h4>
            <div className='flex flex-col gap-4 text-sm font-bold text-slate-300'>
                <Link href='/projects' className='hover:text-white transition-colors'>Selected Works</Link>
                <Link href='/blogs' className='hover:text-white transition-colors'>Engineering Blog</Link>
                <Link href='/packages' className='hover:text-white transition-colors'>Solutions & Plans</Link>
                <Link href='/about' className='hover:text-white transition-colors'>Company Vision</Link>
            </div>
          </div>

          <div className='space-y-8'>
            <h4 className='text-[10px] font-black uppercase tracking-widest '>Information</h4>
            <div className='flex flex-col gap-4 text-sm font-bold text-slate-300'>
                <Link href='/' className='hover:text-white transition-colors'>Privacy Framework</Link>
                <Link href='/' className='hover:text-white transition-colors'>Service Agreement</Link>
                <Link href='/' className='hover:text-white transition-colors'>Refund Protocols</Link>
                <Link href='/contact' className='hover:text-white transition-colors'>Help Center</Link>
            </div>
          </div>

          <div className='space-y-8'>
            <h4 className='text-[10px] font-black uppercase tracking-widest '>HQ & Contact</h4>
            <div className='text-sm font-bold  space-y-4 leading-relaxed'>
                <p>Rahmatpur, Sadar<br/>Mymensingh - 2200, BD</p>
                <p className=''>+880 1805 003886</p>
                <p>contact@disibin.com</p>
            </div>
          </div>
        </div>

        <div className='pt-12 border-t border-slate-800 flex flex-col md:flex-row items-center justify-center gap-6'>
            <p className=' text-[10px] font-black uppercase tracking-widest'>© {currentYear} DISIBIN | ALL RIGHTS RESERVED</p>
            
        </div>
      </div>
    </footer>
  )
}

export default Footer
