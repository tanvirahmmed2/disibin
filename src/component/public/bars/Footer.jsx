import Link from 'next/link'
import React from 'react'
import { FaFacebook, FaInstagram, FaTelegram, FaTwitter, FaYoutube } from 'react-icons/fa'
import NewsLetter from '../pages/NewsLetter';
import { MdCopyright } from 'react-icons/md';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='w-full bg-linear-to-br from-primary to-primary-dark text-slate-300 py-20 border-t border-white/5'>
      <div className='w-full p-6 flex flex-col gap-16'>
        <NewsLetter />
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-10'>



          <div className='space-y-6'>
            <h4 className='text-xs font-semibold uppercase tracking-widest text-slate-50'>Company</h4>
            <div className='flex flex-col gap-3 text-sm text-tertiary-light'>
              <Link href='/products' className='hover:text-secondary transition-colors'>Products</Link>
              <Link href='/about' className='hover:text-secondary transition-colors'>Our Vision</Link>
              <Link href='/board' className='hover:text-secondary transition-colors'>Advisory Board</Link>
              <Link href='/career' className='hover:text-secondary transition-colors'>Careers</Link>
              <Link href='/join-us' className='hover:text-secondary transition-colors'>Join Us</Link>
            </div>
          </div>

          <div className='space-y-6'>
            <h4 className='text-xs font-semibold uppercase tracking-widest text-slate-50'>Resources & Support</h4>
            <div className='flex flex-col gap-3 text-sm text-tertiary-light'>
              <Link href='/faq' className='hover:text-secondary transition-colors'>FAQ</Link>
              <Link href='/contact' className='hover:text-secondary transition-colors'>Support Desk</Link>
              <Link href='/report' className='hover:text-secondary transition-colors'>Report Issue</Link>
              <Link href='/reviews' className='hover:text-secondary transition-colors'>Reviews</Link>
              <Link href='/designs' className='hover:text-secondary transition-colors'>Designs</Link>
            </div>
          </div>

          <div className='space-y-6'>
            <h4 className='text-xs font-semibold uppercase tracking-widest text-slate-50'>Legal Policies</h4>
            <div className='flex flex-col gap-3 text-sm text-tertiary-light'>
              <Link href='/privacy-policy' className='hover:text-secondary transition-colors'>Privacy Policy</Link>
              <Link href='/terms-and-conditions' className='hover:text-secondary transition-colors'>Terms and Conditions</Link>
              <Link href='/refund-policy' className='hover:text-secondary transition-colors'>Refund Policy</Link>
              
            </div>
          </div>

          <div className='space-y-6'>
            <h4 className='text-xs font-semibold uppercase tracking-widest text-slate-50'>Reach Out</h4>
            <div className='text-sm text-tertiary-light space-y-3 leading-relaxed'>
              <p>Rahmatpur, Sadar<br />Mymensingh - 2200, Bangladesh</p>
              <div className="pt-2 flex flex-col gap-1">
                <p className='text-slate-200'>+880 1805 003886</p>
                <p className="text-tertiary-light">support@disibin.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className='pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6'>

          <div className='flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left'>
            <Link href="/" className='text-2xl font-bold tracking-tight text-white font-poppins hover:text-secondary transition-colors'>
              Disibin
            </Link>
            <span className='hidden sm:inline text-white/30'>|</span>
            <p className='text-xs text-slate-300 font-poppins flex items-center gap-1.5'>
              <MdCopyright className="text-slate-400 shrink-0" size={15} />
              <span>{currentYear} Disibin — Digital Solutions & Business Innovation Network. All rights reserved.</span>
            </p>
          </div>

          <div className='flex items-center gap-3'>
            <Link
              href="https://x.com/disibin"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter X"
              className='w-9 h-9 rounded-xl bg-white/5 hover:bg-secondary text-slate-200 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xs'
            >
              <FaTwitter size={16} />
            </Link>
            <Link
              href="https://www.instagram.com/disibin_ltd/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className='w-9 h-9 rounded-xl bg-white/5 hover:bg-secondary text-slate-200 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xs'
            >
              <FaInstagram size={16} />
            </Link>
            <Link
              href="https://www.youtube.com/@Disibin"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className='w-9 h-9 rounded-xl bg-white/5 hover:bg-secondary text-slate-200 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xs'
            >
              <FaYoutube size={16} />
            </Link>
            <Link
              href="https://t.me/disibin"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              className='w-9 h-9 rounded-xl bg-white/5 hover:bg-secondary text-slate-200 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xs'
            >
              <FaTelegram size={16} />
            </Link>
            <Link
              href="https://www.facebook.com/disibin"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className='w-9 h-9 rounded-xl bg-white/5 hover:bg-secondary text-slate-200 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xs'
            >
              <FaFacebook size={16} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
