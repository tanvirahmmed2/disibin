import React from "react";
import { Typewriter } from "react-simple-typewriter";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaPhone, FaTelegram, FaYoutube } from 'react-icons/fa'
import { CiMail } from 'react-icons/ci'



const Intro = () => {
  return (
    <section className="w-full  h-auto p-4 items-center justify-center flex">
        <div className="w-full flex flex-col p-4 items-center justify-center gap-3 text-lg">
          <p className="text-base sm:text-xl md:text-2xl font-semibold">Web & Graphics Development Studio</p>
          <p className="text-8xl font-bold">
            <Typewriter
              words={[" Disibin"]}
              typeSpeed={200}
              delaySpeed={1000}
            />
          </p>
          <h1 className="text-base sm:text-xl md:text-2xl font-semibold">
            Websites & graphics that grow your business
          </h1>
          <p className="text-xs lg:text-base text-center">
            We build modern websites and create standout graphics for small
            teams and startups. Clear messaging, clean visuals, and results you
            can measure
          </p>


          <div className="w-full flex flex-row items-center justify-center gap-4">
            <div className={`flex w-32  mt-2 flex-col  group relative group/item2  hover:bg-transparent transition-all duration-500 ease-out origin-left rounded-lg`}>
              <span className='absolute border-l-2 border-indigo-500 inset-0 bg-indigo-500 w-0 group-hover/item2:w-full transition-all duration-500 ease-out origin-left rounded-lg shadow-lg shadow-indigo-600'></span>
              <Link to='/projects' download className='h-8 w-full gap-2  flex items-center justify-center px-4 rounded-lg z-10  font-semibold  text-red-600 hover:text-white transition duration-1000'>Projects</Link>

            </div>
            <div className={`flex w-32 mt-2 flex-col group relative group/item2  hover:bg-transparent transition-all duration-500 ease-out origin-left rounded-lg`}>
              <span className='absolute border-l-2 border-indigo-500 inset-0 bg-indigo-500 w-0 group-hover/item2:w-full transition-all duration-500 ease-out origin-left rounded-lg shadow-lg shadow-indigo-600'></span>
              <Link to='/contact' download className='h-8 w-full gap-2  flex items-center justify-center px-4 rounded-lg z-10  font-semibold  text-red-600 hover:text-white transition duration-1000'>Hire !</Link>

            </div>
          </div>
          <div className='w-auto h-auto flex flex-row items-center justify-center gap-4'>
            <a className='px-2 p-2 bg-white/20 rounded-lg hover:scale-[1.3] transition duration-500 hover:text-red-500' href="https://www.facebook.com/disibin"><FaFacebook /></a>
            <a className='px-2 p-2 bg-white/20 rounded-lg hover:scale-[1.3] transition duration-500 hover:text-red-500' href="https://www.instagram.com/user.disibin/"><FaInstagram /></a>
            <a className='px-2 p-2 bg-white/20 rounded-lg hover:scale-[1.3] transition duration-500 hover:text-red-500' href="https://www.youtube.com/@Disibin"><FaYoutube /></a>
            <a className='px-2 p-2 bg-white/20 rounded-lg hover:scale-[1.3] transition duration-500 hover:text-red-500' href="mailto:disibin@gmail.com"><CiMail /></a>
            <a className='px-2 p-2 bg-white/20 rounded-lg hover:scale-[1.3] transition duration-500 hover:text-red-500' href="tel:+8801987131369"><FaPhone /></a>
            <a className='px-2 p-2 bg-white/20 rounded-lg hover:scale-[1.3] transition duration-500 hover:text-red-500' href="https://t.me/disibin"><FaTelegram /></a>

          </div>
          <p>Trusted by 20+ business........</p>
        </div>





      
      
    </section>
  );
};

export default Intro;
