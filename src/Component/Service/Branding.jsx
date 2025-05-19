import React, { useState } from 'react'

export default function Branding() {
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
      <h1 className='text-2xl font-bold'>Create Your Brand Identity</h1>
      <p className='text-center'>Your brand is more than just a logo — it’s the voice, style, and story that people remember. We'll help you build a strong, memorable brand identity and promote it effectively across digital and offline platforms.      Whether you’re starting fresh or rebranding, we work with you to create a consistent, professional look and feel that connects with your audience, builds trust, and sets you apart from the competition.</p>
      <div className="features flex flex-col lg:flex-row gap-16 mt-4">
        <ul className='bg-gray-300 p-8 rounded-xl flex flex-col gap-3 w-[400px]'>
          <h3 className='font-bold'>Brand Identity</h3>
          <p >We shape the visual and verbal elements of your brand so it speaks clearly and consistently across all platforms.</p>
          <li><p>Custom logo design</p></li>
          <li><p>Brand color palette and typography</p></li>
          <li><p>Brand guidelines/style guide</p></li>
          <li><p>Business card and stationery design</p></li>
          <li><p>Voice & tone development</p></li>
          <li><p>Taglines and brand messaging</p></li>


        </ul>
        <ul className='bg-gray-300 p-8 rounded-xl flex flex-col gap-3 w-[400px]'>
          <h3 className='font-bold'>Brand Promotion</h3>
          <p>We help you take your brand to the world with strategic marketing and visibility tools that grow awareness and engagement.</p>
          <li><p>Social media branding and content design</p></li>
          <li><p>Digital marketing materials (banners, ads, thumbnails)</p></li>
          <li><p>Branded templates for posts, stories, and reels</p></li>
          <li><p>Promotional videos and product intros</p></li>
          <li><p>Print materials (flyers, brochures, posters)</p></li>
          <li><p>Event or campaign branding. Email and online ad designs</p></li>
        </ul>
      </div>
      <p>A strong brand is your most valuable asset — let us help you craft it, grow it, and make it unforgettable.</p>
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
                <h3>Basic</h3>
                <h3>$50</h3>
              </div>
              <div className='flex flex-col items-start px-4'>

                <p className='font-semibold'>1 Logo designs + color Palette + typography Guide + icon + mockup 3D</p>
                <p>Color palette</p>
                <p>Typography guidelines</p>
                <p>Logo usage guidelines</p>
                <p>Unlimited Revisions</p>
                <p>7-day delivery</p>

              </div>
              <button className='w-full bg-gray-300 cursor-pointer'>Continue</button>
            </div>
            <div className={`w-full ${Standard} flex-col justify-between gap-6`}>
              <div className='w-full flex flex-row items-center justify-around'>
                <h3>Standard</h3>
                <h3>$150</h3>
              </div>
              <div className='flex flex-col items-start px-4'>
                <p className='font-semibold'>2 HQ Logo + vector file + source file + 8 to 10 Pages professional brand guidelines + mockup 3D</p>

                <p>Includes logo design</p>
                <p>Logo usage guidelines</p>
                <p>Color palette</p>
                <p>Typography guidelines</p>
                <p>14-day delivery</p>

              </div>
              <button className='w-full bg-gray-300 cursor-pointer'>Continue</button>
            </div>
            <div className={`w-full ${Premium} flex-col justify-between gap-6`}>
              <div className='w-full flex flex-row items-center justify-around'>
                <h3>Premium</h3>
                <h3>$280</h3>
              </div>
              <div className='flex flex-col items-start px-4'>
                <p className='font-semibold'>3 creative logo + 4 stationary + social media kit + 28 to 30 pages premium brand guide + mockup 3D</p>

                <p>Includes logo design</p>
                <p>Logo usage guidelines</p>
                <p>Color palette</p>
                <p>Typography guidelines</p>
                <p>Brand book design</p>
                <p>21-day delivery</p>

              </div>
              <button className='w-full bg-gray-300 cursor-pointer'>Continue</button>
            </div>

          </div>


        </div>
      </div>
    </div>
  )
}

