import React, { useEffect, useState } from 'react'

const Footer = () => {
  const [year, setYear]= useState(new Date().getFullYear())
  useEffect(()=>{
    setYear(new Date().getFullYear())
  },[])
  return (
    <section className='w-full border-t-2'>
      <footer className='w-full h-auto flex flex-col md:flex-row bg-black/20 items-center justify-around p-6'>
        <div>
          <a href="/" className='text-2xl font-bold'>Disibin</a>
          <p>Web & Graphics Development Studio</p>
        </div>
        <div>
          <p>{year} Disibin. All right reserved</p>
        </div>
      </footer>
    </section>
  )
}

export default Footer
