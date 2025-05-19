import React, {useState} from 'react'

export default function UiUx() {
  let [Basic, setBasic]=useState("flex");
  let [Standard, setStandard]=useState('hidden');
  let [Premium, setPremium]=useState('hidden');
  let [Pack, setPack]=useState('hidden');

  const viewpack=()=>{
    setPack(Pack=='hidden'?'flex':'hidden')
  }

  const gotobasic=()=>{
    setBasic('flex')
    setStandard('hidden')
    setPremium('hidden')
  }
  const gotostandard=()=>{
    setBasic('hidden')
    setStandard('flex')
    setPremium('hidden')
  }
  const gotopremium=()=>{
    setBasic('hidden')
    setStandard('hidden')
    setPremium('flex')
  }

  return (
    <div className='px-18 py-4 flex flex-col gap-8 items-center justify-center w-full  '>
      <h1 className='text-2xl font-bold'>Design Your WebSite</h1>
      <p className='text-center'>we design websites that don’t just look good — they work beautifully. Our goal is to create user-friendly, visually appealing websites that reflect your brand and engage your audience.

        Whether you're a small business, a startup, or a personal brand, we design responsive websites that look great on all devices. We focus on clean layouts, easy navigation, and modern design trends to help your visitors find what they need — fast.
      </p>
      <div className="features flex flex-col lg:flex-row gap-16 mt-4">
        <ul className='bg-gray-300 p-8 rounded-xl flex flex-col gap-3 w-[400px]'>
          <p className='font-bold'>What’s included in our web design services:</p>
          <li><p>Custom layout and visual design</p></li>
          <li><p>User experience (UX) and user interface (UI) focus</p></li>
          <li><p>Branding and color consistency</p></li>
          <li><p>SEO-friendly structure</p></li>
          <li><p>Mobile-friendly (responsive) design</p></li>


        </ul>
        <ul className='bg-gray-300 p-8 rounded-xl flex flex-col gap-3 w-[400px]'>
          <p className='font-bold'>Our Key Features:</p>
          <li><p>Premium Designs & Luxury Themes</p></li>
          <li><p>Elegant Look</p></li>
          <li><p>Premium Features</p></li>
          <li><p>Custom High End Colors</p></li>
          <li><p>24/7 customer care and much more</p></li>
        </ul>
      </div>
      
      <a className='px-4 bg-gray-300 rounded-xl ' href="mailto:disibin@gmail.com">Hire Developer</a>
      <p className='px-4 bg-gray-300 rounded-xl cursor-pointer' onClick={viewpack}>View Packages</p>
        

      
      <div className={`${Pack} flex-col gap-8 items-center justify-center`}>
        <h1 className='text-2xl font-bold'>Web Design package:</h1>
        <div className='w-[526px] h-90 flex flex-col justify-between rounded-xl overflow-hidden border-gray-300 border-1'>
          <div className='w-full mb-2  bg-gray-300 flex items-center justify-between gap-2 overscroll-none'>
            <h3 onClick={gotobasic} className='text-center w-full cursor-pointer hover:bg-white h-8 flex items-center justify-center'>Basic</h3>
            <h3 onClick={gotostandard} className='text-center w-full cursor-pointer hover:bg-white h-8 flex items-center justify-center'>Standard</h3>
            <h3 onClick={gotopremium} className='text-center w-full cursor-pointer hover:bg-white h-8 flex items-center justify-center' >Premium</h3>

          </div>
          <div>
            <div className={`w-full ${Basic} flex-col justify-between gap-6`} >
              <div className='w-full flex flex-row items-center justify-around'>
                <h3>Figma Landing Page Design</h3>
                <h3>$100</h3>
              </div>
              <div className='flex flex-col items-start px-4'>
                
                  <p className='font-semibold'>Custom Landing Page Design (Upto 5 Sections) with Figma | Responsive | No Coding | Discuss More</p>
                  <p>1 page</p>
                  <p>Responsive design</p>
                  <p>Source file</p>
                  <p>Unlimited Revisions</p>
                  <p>3-day delivery</p>
                
              </div>
              <button className='w-full bg-gray-300 cursor-pointer'>Continue</button>
            </div>
            <div  className={`w-full ${Standard} flex-col justify-between gap-6`}>
              <div className='w-full flex flex-row items-center justify-around'>
                <h3>Homepage + 4 Inner Pages in Figma</h3>
                <h3>$400</h3>
              </div>
              <div className='flex flex-col items-start px-4'>
                <p className='font-semibold'>Unique Web Homepage + 4 Inner Pages Design in Figma (Desktop + Mobile) | No Coding | Discuss More </p>

                  <p>5 pages</p>
                  <p>Responsive design</p>
                  <p>Source file</p>
                  <p>Unlimited Revisions</p>
                  <p>7-day delivery</p>
                
              </div>
              <button  className='w-full bg-gray-300 cursor-pointer'>Continue</button>
            </div>
            <div  className={`w-full ${Premium} flex-col justify-between gap-6`}>
              <div className='w-full flex flex-row items-center justify-around'>
                <h3>Homepage + 9 Inner Pages in Figma</h3>
                <h3>$800</h3>
              </div>
              <div className='flex flex-col items-start px-4'>
                <p className='font-semibold'>Unique Web Homepage + 9 Inner Pages Design in Figma (Desktop + Mobile) | No Coding | Discuss More</p>

                  <p>10 pages</p>
                  <p>Responsive design</p>
                  <p>Source file</p>
                  <p>Unlimited Revisions</p>
                  <p>10-day delivery</p>
                
              </div>
              <button  className='w-full bg-gray-300 cursor-pointer'>Continue</button>
            </div>

          </div>


        </div>
      </div>
    </div>
  )
}
