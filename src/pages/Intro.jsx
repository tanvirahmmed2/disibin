import React from "react";
import { Typewriter } from "react-simple-typewriter";
import { Link } from "react-router-dom";
import { FaCode, FaFigma, FaPeopleArrows } from "react-icons/fa6";
import { SiAdobe } from "react-icons/si";

const Intro = () => {
  return (
    <section className="w-full mt-56 lg:mt-0 min-h-screen h-auto p-4">
      <div className="w-full h-screen flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-2">
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
            <div className={`flex w mt-2 flex-col group relative group/item2  hover:bg-transparent transition-all duration-500 ease-out origin-left rounded-lg`}>
              <span className='absolute inset-0 bg-indigo-500 w-0 group-hover/item2:w-full transition-all duration-500 ease-out origin-left rounded-lg shadow-lg shadow-indigo-600'></span>
              <Link to='/projects' download className='h-8 w-full gap-2  flex items-center justify-center px-4 rounded-lg z-10  font-semibold  text-red-600 hover:text-white transition duration-1000'>Projects</Link>

            </div>
            <div className={`flex w-28 mt-2 flex-col group relative group/item2  hover:bg-transparent transition-all duration-500 ease-out origin-left rounded-lg`}>
              <span className='absolute inset-0 bg-indigo-500 w-0 group-hover/item2:w-full transition-all duration-500 ease-out origin-left rounded-lg shadow-lg shadow-indigo-600'></span>
              <Link to='/contact' download className='h-8 w-full gap-2  flex items-center justify-center px-4 rounded-lg z-10  font-semibold  text-red-600 hover:text-white transition duration-1000'>Hire !</Link>

            </div>
          </div>
          <p>Trusted by 20+ business........</p>
        </div>





        <div className="w-full rounded-2xl gap-2 m-4 flex flex-col items-center justify-center  shadow-sm shadow-indigo-500 p-4 border-2 border-red-500 border-opacity-20 bg-white/5">
          <div className="w-full h-auto flex flex-row items-center justify-center gap-2">
            <div className="w-1/3 h-[200px] bg-white/5 rounded-lg flex flex-col items-center justify-center text-xl gap-2 ">
              <p><FaFigma /></p>
              <h1>Web design</h1>
              <Link to="/" className="text-base italic text-red-400">see more....</Link>
            </div>
            <div className="w-2/3 h-[200px] bg-white/5 rounded-lg flex flex-col items-center justify-center text-xl gap-2 ">
              <p><FaCode /></p>
              <h1>Website Development</h1>
              <Link to="/" className="text-base italic text-indigo-400">see more....</Link>
            </div>

          </div>
          <div className="w-full h-auto flex flex-row items-center justify-center gap-2">
            <div className="w-2/3 h-[200px] bg-white/5 rounded-lg flex flex-col items-center justify-center text-xl gap-2 ">
              <p><SiAdobe /></p>
              <h1>Graphics Development</h1>
              <Link to="/" className="text-base italic text-indigo-400">see more....</Link>
            </div>
            <div className="w-1/3 h-[200px] bg-white/5 rounded-lg flex flex-col items-center justify-center text-xl gap-2 ">
              <p><FaPeopleArrows /></p>
              <h1>Consultation</h1>
              <Link to="/" className="text-base italic text-red-400">see more....</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Intro;
