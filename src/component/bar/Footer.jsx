import Link from 'next/link'
import React from 'react'
import { FaFacebook, FaInstagram, FaPhone, FaTelegram, FaYoutube } from 'react-icons/fa'
import { CiMail } from 'react-icons/ci'

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='w-full bg-slate-900 text-white py-32'>
      <div className='container-custom px-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-24'>
          
          <div className='space-y-10'>
            <Link href="/" className='text-4xl font-black tracking-tighter'>Disibin<span className='text-emerald-500'>.</span></Link>
            <p className='text-slate-400 font-medium text-sm leading-relaxed max-w-xs'>
              Architecting high-performance digital ecosystems and strategic software solutions for forward-thinking enterprises globally.
            </p>
            <div className='flex items-center gap-4'>
                <Link href="https://www.facebook.com/disibin" className='w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-emerald-500 hover:border-emerald-500 transition-all duration-300 text-slate-300 hover:text-white'><FaFacebook size={18} /></Link>
                <Link href="https://www.instagram.com/user.disibin/" className='w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-emerald-500 hover:border-emerald-500 transition-all duration-300 text-slate-300 hover:text-white'><FaInstagram size={18} /></Link>
                <Link href="https://t.me/disibin" className='w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-emerald-500 hover:border-emerald-500 transition-all duration-300 text-slate-300 hover:text-white'><FaTelegram size={18} /></Link>
            </div>
          </div>

          <div className='space-y-10'>
            <h4 className='text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500'>Platform</h4>
            <div className='flex flex-col gap-5 text-sm font-bold text-slate-300'>
                <Link href='/projects' className='hover:text-white transition-all duration-300 inline-flex items-center gap-2'>Selected Works</Link>
                <Link href='/blogs' className='hover:text-white transition-all duration-300'>Engineering Blog</Link>
                <Link href='/packages' className='hover:text-white transition-all duration-300'>Service Plans</Link>
                <Link href='/about' className='hover:text-white transition-all duration-300'>Our Vision</Link>
            </div>
          </div>

          <div className='space-y-10'>
            <h4 className='text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500'>Legal & Help</h4>
            <div className='flex flex-col gap-5 text-sm font-bold text-slate-300'>
                <Link href='/' className='hover:text-white transition-all duration-300'>Privacy Policy</Link>
                <Link href='/' className='hover:text-white transition-all duration-300'>Terms of Service</Link>
                <Link href='/' className='hover:text-white transition-all duration-300'>Refund Policy</Link>
                <Link href='/contact' className='hover:text-white transition-all duration-300'>Support Desk</Link>
            </div>
          </div>

          <div className='space-y-10'>
            <h4 className='text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500'>Reach Out</h4>
            <div className='text-sm font-bold text-slate-300 space-y-5 leading-relaxed'>
                <p>Rahmatpur, Sadar<br/>Mymensingh - 2200, BD</p>
                <div className="pt-2">
                  <p className='text-white'>+880 1805 003886</p>
                  <p className="text-emerald-500">contact@disibin.com</p>
                </div>
            </div>
          </div>
        </div>

        <div className='pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-center'>
            <p className='text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]'>© {currentYear} DISIBIN | Precision Engineering</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
