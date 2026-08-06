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
            </div>
          </div>

          <div className='space-y-6'>
            <h4 className='text-xs font-semibold uppercase tracking-widest text-slate-50'>Legal Policies</h4>
            <div className='flex flex-col gap-3 text-sm text-tertiary-light'>
              <Link href='/privacy-policy' className='hover:text-secondary transition-colors'>Privacy Policy</Link>
              <Link href='/terms-of-service' className='hover:text-secondary transition-colors'>Terms of Service</Link>
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

        <div className='flex flex-col md:flex-row items-center justify-between'>
          <div className='w-full flex flex-row items-center justify-center gap-4'>
            <Link href="/" className='text-3xl font-bold tracking-tight text-white'>Disibin</Link>
            <p className='flex flex-row items-center justify-center gap-4 text-xs'>
              <MdCopyright/> Disibin International Ltd 2026
            </p>
          </div>

          <div className='w-full flex flex-row items-center justify-center gap-4'>
            <Link href="https://x.com/disibin" className='hover:text-secondary transition-colors'><FaTwitter size={20} /></Link>
            <Link href="https://www.instagram.com/disibin_ltd/" className='hover:text-secondary transition-colors'><FaInstagram size={20} /></Link>
            <Link href="https://www.youtube.com/@Disibin" className='hover:text-secondary transition-colors'><FaYoutube size={20} /></Link>
            <Link href="https://t.me/disibin" className='hover:text-secondary transition-colors'><FaTelegram size={20} /></Link>
            <Link href="https://www.facebook.com/disibin" className='hover:text-secondary transition-colors'><FaFacebook size={20} /></Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
