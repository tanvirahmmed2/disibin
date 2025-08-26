import React, { useState } from "react";
import {motion} from "framer-motion"
import { Link } from "react-router-dom";
import UsePageTitle from "../component/UsePageTitle"
import {
  FaCaretDown,
  FaCode,
  FaFigma,
  FaPhotoVideo,
  FaPlane,
} from "react-icons/fa";

const Service = () => {
  UsePageTitle("services")

  const [firstfaq, setFirstFaq] = useState(false);
  const [secondfaq, setSecondFaq] = useState(false);
  const [thirdfaq, setThirdFaq] = useState(false);
  const handlefirstfaq = () => {
    setFirstFaq(!firstfaq);
  };
  const handlesecondfaq = () => {
    setSecondFaq(!secondfaq);
  };
  const handlethirdfaq = () => {
    setThirdFaq(!thirdfaq);
  };

  return (
    <section className="w-full mt-20  min-h-screen p-8 flex flex-col gap-12 items-center justify-start">
      <div className="flex w-full items-center justify-center gap-2 flex-col">
        <h1 className="text-5xl font-semibold">What we do</h1>
        <p className="text-lg">
          End-to-end services to launch fast and grow steadily.
        </p>
      </div>




      <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-4 p-4">

        
        <motion.div initial={{scale:0.9, opacity:0}} whileInView={{scale:1, opacity:1}} transition={{duration:0.5}} className="w-full h-[230px] p-4 text-center flex flex-col items-center justify-center gap-2 shadow-sm shadow-indigo-500 border-2 border-red-500 rounded-xl border-opacity-20">
          <p className="text-2xl">
            <FaFigma />
          </p>
          <h1 className="text-2xl font-bold">Website Design</h1>
          <p>
            Modern, responsive designs that look great on phones and desktops.
          </p>
          <Link to="/webdesign" className="italic text-indigo-500">
            See examples
          </Link>
        </motion.div>


        <motion.div initial={{scale:0.9, opacity:0}} whileInView={{scale:1, opacity:1}} transition={{duration:0.5}} className="w-full h-[230px] p-4 text-center flex flex-col items-center justify-center gap-2 shadow-sm shadow-indigo-500 border-2 border-red-500 rounded-xl border-opacity-20">
          <p className="text-2xl">
            <FaCode />
          </p>
          <h1 className="text-2xl font-bold">Web Development</h1>
          <p>Fast, reliable builds with best practices and clean structure.</p>
          <Link to="/webdev" className="italic text-indigo-500">
            What’s included?
          </Link>
        </motion.div>


        <motion.div initial={{scale:0.9, opacity:0}} whileInView={{scale:1, opacity:1}} transition={{duration:0.5}} className="w-full h-[230px] p-4 text-center flex flex-col items-center justify-center gap-2 shadow-sm shadow-indigo-500 border-2 border-red-500 rounded-xl border-opacity-20">
          <p className="text-2xl">
            <FaPhotoVideo />
          </p>
          <h1 className="text-2xl font-bold">Graphic Design</h1>
          <p>
            Branding, social graphics, and marketing visuals that tell your
            story.
          </p>
          <Link to="/graphicdev" className="italic text-indigo-500">
            See options
          </Link>
        </motion.div>

        <motion.div initial={{scale:0.9, opacity:0}} whileInView={{scale:1, opacity:1}} transition={{duration:0.5}} className="w-full h-[230px] p-4 text-center flex flex-col items-center justify-center gap-2 shadow-sm shadow-indigo-500 border-2 border-red-500 rounded-xl border-opacity-20">
          <p className="text-2xl">
            <FaPlane />
          </p>
          <h1 className="text-2xl font-bold">Care Plans</h1>
          <p>
            Hosting, updates, and support so your site stays fast and secure.
          </p>
          <Link to="/care" className="italic text-indigo-500">
            View plans
          </Link>
        </motion.div>

      </div>

      <div className="flex w-full items-start justify-center gap-2 flex-col">
        <h1 className="text-4xl font-semibold">How we work</h1>
        <p className="">Simple steps. Clear timelines.</p>
      </div>

      <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-8">
        <motion.div initial={{ opacity:0, x:-40}} whileInView={{ opacity:1, x:0}} transition={{duration:0.5}} className="w-full flex flex-col gap-8 items-center justify-center">
          <div className="w-full h-[120px] p-4 flex flex-row items-center justify-start gap-2 shadow-sm shadow-black border-2 border-red-500 rounded-xl border-opacity-20">
            <p className="text-2xl px-3 py-1 rounded-full bg-white/10">1</p>
            <div>
              <h1 className="text-2xl font-semibold">Discover</h1>
              <p>
                We learn about your goals, audience, and content. Quick call +
                checklist
              </p>
            </div>
          </div>
          <div className="w-full h-[120px] p-4 flex flex-row items-center justify-start gap-2 shadow-sm shadow-black border-2 border-red-500 rounded-xl border-opacity-20">
            <p className="text-2xl px-3 py-1 rounded-full bg-white/10">2</p>
            <div>
              <h1 className="text-2xl font-semibold">Design</h1>
              <p>Homepage first, then inner pages. Feedback at every step</p>
            </div>
          </div>
          <div className="w-full h-[120px] p-4 flex flex-row items-center justify-start gap-2 shadow-sm shadow-black border-2 border-red-500 rounded-xl border-opacity-20">
            <p className="text-2xl px-3 py-1 rounded-full bg-white/10">3</p>
            <div>
              <h1 className="text-2xl font-semibold">Build & Launch</h1>
              <p>We set up hosting, connect your domain, and go live</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity:0, x:40}} whileInView={{ opacity:1, x:0}} transition={{duration:0.5}} className="w-full h-auto p-2 flex-col flex items-center justify-center  gap-8">
          <h1 className="text-2xl">FAQs</h1>
          <div className="w-full p-4 shadow-sm shadow-black flex flex-col gap-2 border-2 border-red-500 rounded-xl border-opacity-20">
            <div className="w-full flex flex-row items-center justify-between">
              <p>Do you write copy?</p>
              <p onClick={handlefirstfaq} className={`cursor-pointer`}>
                <FaCaretDown />
              </p>
            </div>
            <p className={` ${firstfaq ? "block" : "hidden"}`}>
              Yes, we can help with messaging, headlines, and structure.
            </p>
          </div>
          <div className="w-full p-4 shadow-sm shadow-black flex flex-col gap-2 border-2 border-red-500 rounded-xl border-opacity-20">
            <div className="w-full flex flex-row items-center justify-between">
              <p>What tools do you use?</p>
              <p onClick={handlesecondfaq} className={`cursor-pointer `}>
                <FaCaretDown />
              </p>
            </div>
            <p className={` ${secondfaq ? "block" : "hidden"}`}>
              Simple, dependable tools to keep things fast and stable.
            </p>
          </div>
          <div className="w-full p-4 shadow-sm shadow-black flex flex-col gap-2 border-2 border-red-500 rounded-xl border-opacity-20">
            <div className="w-full flex flex-row items-center justify-between">
              <p>How fast can we launch?</p>
              <p onClick={handlethirdfaq} className={`cursor-pointer `}>
                <FaCaretDown />
              </p>
            </div>
            <p className={` ${thirdfaq ? "block" : "hidden"}`}>
              Most landing pages: 5–10 days. Small websites: 2–4 weeks.
            </p>
          </div>
        </motion.div>
      </div>

      <div className="w-full flex flex-col items-center justify-center gap-4 p-8">
        <div className="w-full flex flex-col items-end gap-4">
          <h1 className="text-4xl font-semibold text-end">Straightforward pricing</h1>
          <p>Pick what fits today. Upgrade anytime.</p>
        </div>
        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-4">

          <motion.div initial={{scale:0.9, opacity:0}} whileInView={{scale:1, opacity:1}} transition={{duration:0.5}} className="w-full h-[300px] p-4 flex flex-col items-start justify-between shadow-sm shadow-indigo-500 border-2 border-red-500 rounded-xl border-opacity-20">
            <h1 className="text-2xl font-bold">Starter</h1>
            <p className="italic">Perfect for one-page sites</p>
            <div className="w-full flex flex-row items-end gap-2">
              <h1 className="text-4xl font-semibold">$499 </h1>
              <p>/ project</p>
            </div>
            <p>1 page, copy help</p>
            <p>Mobile-ready</p>
            <p>Basic SEO</p>
            <button className="w-full text-center rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-500">Start here</button>
          </motion.div>


          <motion.div initial={{scale:0.9, opacity:0}} whileInView={{scale:1, opacity:1}} transition={{duration:0.5}} className="w-full h-[300px] p-4 flex flex-col items-start justify-between shadow-sm shadow-indigo-500 border-2 border-red-500 rounded-xl border-opacity-20">
            <h1 className="text-2xl font-bold">Business</h1>
            <p className="italic">Great for small teams</p>
            <div className="w-full flex flex-row items-end gap-2">
              <h1 className="text-4xl font-semibold">$1,499</h1>
              <p>/ project</p>
            </div>
            <p>Up to 5 pages</p>
            <p>Lead forms + analytics</p>
            <p>Speed & SEO setup</p>
            <button className="w-full text-center rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-500">Book a lot</button>
          </motion.div>


          <motion.div initial={{scale:0.9, opacity:0}} whileInView={{scale:1, opacity:1}} transition={{duration:0.5}} className="w-full h-[300px] p-4 flex flex-col items-start justify-between shadow-sm shadow-indigo-500 border-2 border-red-500 rounded-xl border-opacity-20">
            <h1 className="text-2xl font-bold">Care Plan</h1>
            <p className="italic">Keep it fast & secure</p>
            <div className="w-full flex flex-row items-end gap-2">
              <h1 className="text-4xl font-semibold">$79 </h1>
              <p>/ mo</p>
            </div>
            <p>Hosting & updates</p>
            <p>Backups & security</p>
            <p>Minor changes</p>
            <button className="w-full text-center rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-500">Subscribe</button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Service;
