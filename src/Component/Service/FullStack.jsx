import React, { useState } from 'react'

export default function FullStack() {
  let [Basic, setBasic] = useState("flex");
  let [Standard, setStandard] = useState('hidden');
  let [Premium, setPremium] = useState('hidden');
  let [Pack, setPack] = useState('hidden');

  const viewpack = () => {
    setPack(Pack == 'hidden' ? 'flex' : 'hidden')
  }

  const gotobasic = () => {
    setBasic('flex')
    setStandard('hidden')
    setPremium('hidden')
  }
  const gotostandard = () => {
    setBasic('hidden')
    setStandard('flex')
    setPremium('hidden')
  }
  const gotopremium = () => {
    setBasic('hidden')
    setStandard('hidden')
    setPremium('flex')
  }

  return (
    <div className='px-18 py-4 flex flex-col gap-8 items-center justify-center w-full  '>
      <h1 className='text-2xl font-bold'>Build Your Interface with Strong DataBase</h1>
      <p className='text-center'>We deliver complete end-to-end web development solutions — from intuitive user interfaces to robust backend systems. As full stack developers, we handle both the front and back ends of your project, ensuring seamless integration, faster delivery, and unified quality across your entire application. Whether you're building a landing page, SaaS product, or complex business platform, we provide the full technical package.</p>

      <div className="features flex flex-col lg:flex-row gap-16 mt-4">
        <ul className='bg-gray-300 p-8 rounded-xl flex flex-col gap-3 w-[400px]'>
          <h3 className='font-bold'>What we offer:</h3>
          <p >Complete Web Development – One team to handle everything from UI design to database management and deployment.</p>
          <li><p>Modern Frontend Frameworks – Responsive, interactive interfaces built with React, Vue, or other modern technologies.</p></li>

          <li><p>Scalable Backend Architecture – Secure and performant server-side logic built with Node.js, Express, Django, or similar.</p></li>
          <li><p>Database Integration – Setup and management of relational (PostgreSQL, MySQL) or NoSQL (MongoDB) databases.</p></li>
          <li><p>API Development & Integration – Seamless connection between frontend, backend, and third-party services.</p></li>

        </ul>
        <ul className='bg-gray-300 p-8 rounded-xl flex flex-col gap-3 w-[400px]'>
          <h3 className='font-bold'>Why choose us:</h3>
          <p>Single point of contact for your entire tech stack</p>
          <li><p>Faster development and better coordination between frontend and backend</p></li>
          <li><p>Clean, scalable, and maintainable codebase</p></li>
          <li><p>Transparent communication and agile workflows</p></li>
          <li><p>Post-launch support, updates, and performance monitoring</p></li>

        </ul>
      </div>
      <p>We bring your digital vision to life — handling every layer of your web application so you can focus on growth, not the tech.</p>
      <a className='px-4 bg-gray-300 rounded-xl ' href="mailto:disibin@gmail.com">Hire Developer</a>
      <p className='px-4 bg-gray-300 rounded-xl cursor-pointer' onClick={viewpack}>View Packages</p>



      <div className={`${Pack} flex-col gap-8 items-center justify-center`}>
        <h1 className='text-2xl font-bold'>Build Your Fast DataBase</h1>
        <div className='w-[526px] h-100 flex flex-col justify-between rounded-xl overflow-hidden border-gray-300 border-1'>
          <div className='w-full mb-2  bg-gray-300 flex items-center justify-between gap-2 overscroll-none'>
            <h3 onClick={gotobasic} className='text-center w-full cursor-pointer hover:bg-white h-8 flex items-center justify-center'>Basic</h3>
            <h3 onClick={gotostandard} className='text-center w-full cursor-pointer hover:bg-white h-8 flex items-center justify-center'>Standard</h3>
            <h3 onClick={gotopremium} className='text-center w-full cursor-pointer hover:bg-white h-8 flex items-center justify-center' >Premium</h3>

          </div>
          <div>
            <div className={`w-full ${Basic} flex-col justify-between gap-6`} >
              <div className='w-full flex flex-row items-center justify-around'>
                <h3>Basic</h3>
                <h3>$80</h3>
              </div>
              <div className='flex flex-col items-start px-4'>

                <p className='font-semibold'>High Converting Landing Page design, Premium theme, BLOG, Image Slider, Social Media, Contact Form</p>
                <p>Functional website</p>
                <p>1 page</p>
                <p>Responsive design</p>
                <p>Content upload</p>
                <p>Opt-in form</p>
                <p>5 plugins/extensions including social media</p>
                <p>3-day delivery</p>
                <p>3 Revision</p>

              </div>
              <button className='w-full bg-gray-300 cursor-pointer'>Continue</button>
            </div>
            <div className={`w-full ${Standard} flex-col justify-between gap-6`}>
              <div className='w-full flex flex-row items-center justify-around'>
                <h3>BUSINESS</h3>
                <h3>$350</h3>
              </div>
              <div className='flex flex-col items-start px-4'>
                <p className='font-semibold'>4 Page Responsive Website, Basic + Security, Stock Images, Page Builder, Google Map, Support</p>

                <p>Functional website</p>
                <p>4 pages</p>
                <p>Responsive design</p>
                <p>Content upload</p>
                <p>Hosting setup</p>
                <p>7 plugins/extensions including social media link</p>
                <p>5-day delivery</p>
                <p>5 revision</p>

              </div>
              <button className='w-full bg-gray-300 cursor-pointer'>Continue</button>
            </div>
            <div className={`w-full ${Premium} flex-col justify-between gap-6`}>
              <div className='w-full flex flex-row items-center justify-around'>
                <h3>BUSINESS PLUS</h3>
                <h3>$550</h3>
              </div>
              <div className='flex flex-col items-start px-4'>
                <p className='font-semibold'>7 Page Commercial website development (10 products), Standard, Speed & SEO optimized, Color Branding</p>

                <p>Functional website</p>
                <p>7 pages</p>
                <p>Responsive design</p>
                <p>Content upload</p>
                <p>10 plugins/extensions</p>
                <p>Hosting setup & Speed optimization</p>
                <p>7-day delivery</p>
                <p>7 Revision</p>

              </div>
              <button className='w-full bg-gray-300 cursor-pointer'>Continue</button>
            </div>

          </div>


        </div>
      </div>
    </div>
  )
}