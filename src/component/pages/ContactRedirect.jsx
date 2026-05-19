import Link from 'next/link'
import React from 'react'

const ContactRedirect = () => {
  return (
    <div className='w-full flex flex-col items-center justify-center gap-4 text-center p-4'>
      <p className='text-4xl md:text-7xl bg-linear-to-br from-white to-slate-300 bg-clip-text'>Ready to build something great?</p>
      <p>Tell us about your plan & we&apos;ll get back very soon!</p>
      <Link href={'/contact'}>Write</Link>
    </div>
  )
}

export default ContactRedirect
