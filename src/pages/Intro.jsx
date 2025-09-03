import React from "react";
import { Typewriter } from "react-simple-typewriter";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaPhone, FaTelegram, FaYoutube } from 'react-icons/fa'
import { CiMail } from 'react-icons/ci'



const Intro = () => {
  return (
    <section className="w-full  h-auto p-4">
      <div className="w-full h-auto flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-2">
        <div className="w-full flex flex-col p-4 items-start justify-center gap-3 text-lg">
          <p>Web & Graphics Development Studio</p>
          <p className="text-8xl font-bold">
            <Typewriter
              words={[" Disibin"]}
              typeSpeed={200}
              delaySpeed={1000}
            />
          </p>
          <h1 className="text-3xl">
            Websites & graphics that grow your business
          </h1>
          <p>
            We build modern websites and create standout graphics for small
            teams and startups. Clear messaging, clean visuals, and results you
            can measure
          </p>


          <div className="w-full flex flex-row items-center justify-start gap-4">
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





        <div className="w-full rounded-2xl gap-2 m-4 flex flex-col items-center justify-center opacity-100 shadow-sm shadow-indigo-500 p-4 border-2 border-red-500 border-opacity-20 bg-white/5">

          <div className="w-full h-auto flex flex-row items-center justify-center gap-2">
            <div className="w-1/3 h-[200px] bg-white/5 overflow-hidden cursor-pointer hover:scale-105 opacity-50 hover:opacity-100 transition duration-300 rounded-lg flex flex-col items-center justify-center text-xl gap-2 ">
              <img src="https://res.cloudinary.com/dz45x9efk/image/upload/v1756875260/webdesign_eeslve.jpg" alt="" className="w-full h-[200px] object-cover " />
            </div>
            <div className="w-2/3 h-[200px] bg-emerald-400 overflow-hidden cursor-pointer hover:scale-105 transition opacity-50 hover:opacity-100 duration-300 rounded-lg flex flex-col items-center justify-center text-xl gap-2 ">
              <img src="https://res.cloudinary.com/dz45x9efk/image/upload/v1756875256/webdev_aphw47.jpg" alt="" className="w-full h-[200px] object-cover " />
            </div>

          </div>

          <div className="w-full h-auto flex flex-row items-center justify-center gap-2">
            <div className="w-2/3 h-[200px] overflow-hidden  bg-emerald-400  cursor-pointer hover:scale-105 transition duration-300 opacity-50 hover:opacity-100 rounded-lg flex flex-col items-center justify-center text-xl gap-2 ">
              <img src="https://res.cloudinary.com/dz45x9efk/image/upload/v1756875259/graphicsdesign_va594g.jpg" alt="grphicsdesignimg" className="w-full h-[200px] object-cover " />


            </div>
            <div className="w-1/3 h-[200px] bg-white/5 cursor-pointer hover:scale-105 transition overflow-hidden duration-300  rounded-lg flex  opacity-50 hover:opacity-100 flex-col items-center justify-center text-xl gap-2 ">
              <img src="https://res.cloudinary.com/dz45x9efk/image/upload/v1756875259/care_rfsmrw.jpg" alt="" className="w-full h-[200px] object-cover " />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Intro;
