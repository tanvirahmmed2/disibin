import React, { useContext } from "react";
import { CreateContext } from "../component/Context/CreateContext";
import Package from "./Package";
import UsePageTitle from '../component/UsePageTitle'

const GraphicsDesign = () => {
  
    UsePageTitle("Graphics Design")
  const { packagesData } = useContext(CreateContext);
  const graphicsPackage = packagesData.filter(p => p.category === "graphicsdesign");

  return (
    <div className="w-full my-14 p-4 h-auto flex flex-col gap-6 items-center justify-center">
      <div className="w-full flex text-center flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-semibold">Graphic Design Services</h1>
        <p>Our graphic design services bring your brand to life. From logos to full brand identity, we deliver visually compelling designs that communicate your message and resonate with your audience.</p>
      </div>

      <div className="w-full h-auto flex flex-col lg:flex-row items-center justify-center gap-20">
        <div className="p-4 h-60 flex flex-col items-start justify-between px-12 gap-2 rounded-lg bg-white/5 w-[400px]">
          <h1 className="text-lg font-semibold italic">What’s included in our graphic design services:</h1>
          <p>Logo and brand design</p>
          <p>Business cards and stationery</p>
          <p>Social media kit design</p>
          <p>Custom creative solutions</p>
        </div>
        <div className="p-4 h-60 flex flex-col items-start justify-between px-12 gap-2 rounded-lg bg-white/5 w-[400px]">
          <h1 className="text-lg font-semibold italic">Our Key Features</h1>
          <p>Unique and professional designs</p>
          <p>High-resolution outputs</p>
          <p>Custom color schemes</p>
          <p>Unlimited revisions</p>
          <p>24/7 creative support</p>
        </div>
      </div>

      <h1 className="text-3xl font-semibold mt-6">Choose any package</h1>
      <div className="w-full flex flex-col items-center justify-center gap-6 lg:flex-row">
        {graphicsPackage.map(packages => {
          const { title, price, description, features, id, pack } = packages;
          return (
            <Package
              key={id}
              title={title}
              price={price}
              description={description}
              features={features}
              pack={pack}
            />
          );
        })}
      </div>
    </div>
  );
};

export default GraphicsDesign;
