import Link from 'next/link'
import React from 'react'
import { FaFacebook, FaInstagram, FaPhone, FaTelegram, FaYoutube } from 'react-icons/fa'
import { CiMail } from 'react-icons/ci'

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='w-full bg-slate-900 text-white py-24'>
      <div className='container-custom'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20'>
          
          <div className='space-y-8'>
            <Link href="/" className='text-3xl font-black tracking-tighter'>Disibin<span className='text-primary/50'>.</span></Link>
            <p className='text-slate-400 font-medium text-sm leading-relaxed max-w-xs'>
              Architecting high-performance digital ecosystems for forward-thinking enterprises globally.
            </p>
            <div className='flex items-center gap-4'>
                <Link href="https://www.facebook.com/disibin" className='w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-primary transition-all'><FaFacebook /></Link>
                <Link href="https://www.instagram.com/user.disibin/" className='w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-primary transition-all'><FaInstagram /></Link>
                <Link href="https://t.me/disibin" className='w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-primary transition-all'><FaTelegram /></Link>
            </div>
          </div>

          <div className='space-y-8'>
            <h4 className='text-[10px] font-black uppercase tracking-widest text-primary/50'>Core Navigation</h4>
            <div className='flex flex-col gap-4 text-sm font-bold text-slate-300'>
                <Link href='/projects' className='hover:text-white transition-colors'>Selected Works</Link>
                <Link href='/blogs' className='hover:text-white transition-colors'>Engineering Blog</Link>
                <Link href='/packages' className='hover:text-white transition-colors'>Solutions & Plans</Link>
                <Link href='/about' className='hover:text-white transition-colors'>Company Vision</Link>
            </div>
          </div>

          <div className='space-y-8'>
            <h4 className='text-[10px] font-black uppercase tracking-widest text-primary/50'>Information</h4>
            <div className='flex flex-col gap-4 text-sm font-bold text-slate-300'>
                <Link href='/' className='hover:text-white transition-colors'>Privacy Framework</Link>
                <Link href='/' className='hover:text-white transition-colors'>Service Agreement</Link>
                <Link href='/' className='hover:text-white transition-colors'>Refund Protocols</Link>
                <Link href='/contact' className='hover:text-white transition-colors'>Help Center</Link>
            </div>
          </div>

          <div className='space-y-8'>
            <h4 className='text-[10px] font-black uppercase tracking-widest text-primary/50'>HQ & Contact</h4>
            <div className='text-sm font-bold text-slate-300 space-y-4 leading-relaxed'>
                <p>Rahmatpur, Sadar<br/>Mymensingh - 2200, BD</p>
                <p className='text-primary/50'>+880 1805 003886</p>
                <p>contact@disibin.com</p>
            </div>
          </div>
        </div>

        <div className='pt-12 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6'>
            <p className='text-slate-500 text-[10px] font-black uppercase tracking-widest'>© {currentYear} DISIBIN INFRASTRUCTURE | ALL RIGHTS RESERVED</p>
            <div className='flex items-center gap-8 text-slate-500 text-[10px] font-black uppercase tracking-widest'>
                <Link href='/' className='hover:text-primary/50 transition-colors'>System Status</Link>
                <Link href='/' className='hover:text-primary/50 transition-colors'>API Docs</Link>
            </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
