import React, { useContext } from "react";
import { CreateContext } from "../component/Context/CreateContext"; // match your file path
import Package from "./Package";



const WebDesign = () => {
    const {packagesData} =useContext(CreateContext)
    const webdesignPackage = packagesData.filter(p => p.category === "webdesign");
  return (
    <div className="w-full my-14 p-4 h-auto flex flex-col gap-6 items-center justify-center">
        <div className="w-full flex text-center flex-col items-center justify-center gap-4">
            <h1 className="text-3xl font-semibold">Design Your WebSite</h1>
            <p>we design websites that don’t just look good — they work beautifully. Our goal is to create user-friendly, visually appealing websites that reflect your brand and engage your audience. Whether you're a small business, a startup, or a personal brand, we design responsive websites that look great on all devices. We focus on clean layouts, easy navigation, and modern design trends to help your visitors find what they need — fast.</p>
        </div>


        <div className="w-full h-auto flex flex-col lg:flex-row items-center justify-center gap-20">
            <div className=" p-4 h-60  flex flex-col items-start justify-between px-12 gap-2 rounded-lg bg-white/5">
                <h1 className="text-lg font-semibold italic">What’s included in our web design services:</h1>
                <p>Custom layout and visual design</p>
                <p>User experience (UX) and user interface (UI) focus</p>
                <p>Branding and color consistency</p>
                <p>Mobile-friendly (responsive) design</p>
            </div>
            <div className=" p-4 h-60  flex flex-col items-start justify-between px-12 gap-2 rounded-lg bg-white/5">
                <h1 className="text-lg font-semibold italic">Our Key Features</h1>
                <p>Premium Designs & Luxury Themes</p>
                <p>Elegant Look</p>
                <p>Premium Features</p>
                <p>Custom High End Colors</p>
                <p>24/7 customer care and much more</p>
            </div>
        </div>

        <h1 className="text-3xl font-semibold mt-6">Choose any package</h1>
        <div className="w-full flex flex-col items-center justify-center gap-6 lg:flex-row ">
            {
                webdesignPackage.map((packages)=>{
                    const {title, price, description, features, id,pack, }= packages
                    return <Package key={id} title={title} price={price} description={description} features={features} pack={pack} />
                })
            }
        </div>
      
    </div>
  )
}

export default WebDesign
