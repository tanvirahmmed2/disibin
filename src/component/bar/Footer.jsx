import Link from 'next/link'
import React from 'react'
import { FaFacebook, FaInstagram, FaTelegram, FaYoutube } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='w-full bg-slate-950 text-slate-300 py-20 border-t border-white/5'>
      <div className='max-w-7xl mx-auto px-6'>
        {/* Top CTA Banner */}
        <div className='w-full bg-slate-900 rounded-3xl p-8 md:p-12 mb-20 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5 relative overflow-hidden'>
          {/* Background Glow */}
          <div className='absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/10 blur-[100px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3' />
          
          <div className='flex flex-col gap-4 relative z-10 text-center md:text-left max-w-2xl'>
            <h2 className='text-3xl md:text-5xl font-poppins font-bold bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent tracking-tight leading-tight'>
              Ready to build something great?
            </h2>
            <p className='text-slate-400 text-lg'>
              Tell us about your plan & we&apos;ll get back to you very soon!
            </p>
          </div>
          
          <Link href={'/contact'} className='relative z-10 shrink-0 bg-white text-slate-950 px-8 py-4 rounded-full font-semibold hover:bg-sky-50 hover:-translate-y-1 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.1)]'>
            Get in touch
          </Link>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16'>

          <div className='space-y-6'>
            <Link href="/" className='text-3xl font-bold tracking-tight text-white'>Disibin</Link>
            <p className='text-slate-400 text-sm leading-relaxed max-w-xs'>
              Architecting high-performance digital ecosystems and strategic software solutions for forward-thinking enterprises globally.
            </p>
            <div className='flex items-center gap-5 pt-2'>
              <Link href="https://www.facebook.com/disibin" className='hover:text-sky-500 transition-colors'><FaFacebook size={20} /></Link>
              <Link href="https://www.instagram.com/disibin_ltd/" className='hover:text-pink-500 transition-colors'><FaInstagram size={20} /></Link>
              <Link href="https://www.youtube.com/@Disibin" className='hover:text-red-500 transition-colors'><FaYoutube size={20} /></Link>
              <Link href="https://t.me/disibin" className='hover:text-sky-400 transition-colors'><FaTelegram size={20} /></Link>
            </div>
          </div>

          {/* Platform Links */}
          <div className='space-y-6'>
            <h4 className='text-xs font-semibold uppercase tracking-widest text-slate-50'>Platform</h4>
            <div className='flex flex-col gap-3 text-sm text-slate-400'>
              <Link href='/projects' className='hover:text-sky-400 transition-colors'>Selected Works</Link>
              <Link href='/products' className='hover:text-sky-400 transition-colors'>Products</Link>
              <Link href='/about' className='hover:text-sky-400 transition-colors'>Our Vision</Link>
              <Link href='/team' className='hover:text-sky-400 transition-colors'>Dedicated Team</Link>
              <Link href='/career' className='hover:text-sky-400 transition-colors'>Careers</Link>
            </div>
          </div>

          {/* Legal Links */}
          <div className='space-y-6'>
            <h4 className='text-xs font-semibold uppercase tracking-widest text-slate-50'>Legal & Help</h4>
            <div className='flex flex-col gap-3 text-sm text-slate-400'>
              <Link href='/privacy-policy' className='hover:text-sky-400 transition-colors'>Privacy Policy</Link>
              <Link href='/terms-of-service' className='hover:text-sky-400 transition-colors'>Terms of Service</Link>
              <Link href='/refund-policy' className='hover:text-sky-400 transition-colors'>Refund Policy</Link>
              <Link href='/contact' className='hover:text-sky-400 transition-colors'>Support Desk</Link>
            </div>
          </div>

          {/* Contact */}
          <div className='space-y-6'>
            <h4 className='text-xs font-semibold uppercase tracking-widest text-slate-50'>Reach Out</h4>
            <div className='text-sm text-slate-400 space-y-3 leading-relaxed'>
              <p>Rahmatpur, Sadar<br />Mymensingh - 2200, Bangladesh</p>
              <div className="pt-2 flex flex-col gap-1">
                <p className='text-slate-200'>+880 1805 003886</p>
                <p className="text-sky-400">disibin@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className='pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4'>
          <p className='text-slate-500 text-xs tracking-wider'>© {currentYear} DISIBIN.</p>
          <p className='text-slate-500 text-xs tracking-wider uppercase font-medium'>Global Network</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
