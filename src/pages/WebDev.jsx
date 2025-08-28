import React, { useContext } from "react";
import { CreateContext } from "../component/Context/CreateContext";
import Package from "./Package";
import UsePageTitle from "../component/UsePageTitle";

const WebDev = () => {
  UsePageTitle("Web Development");
  const { packages } = useContext(CreateContext);

  

  return (
    <div className="w-full my-14 p-4 h-auto flex flex-col gap-6 items-center justify-center">
      <div className="w-full flex text-center flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-semibold">Build Your Website</h1>
        <p>
          We develop responsive, functional websites that grow your business. From startups to enterprise projects, our websites are fast, secure, and SEO-friendly. Focused on usability and modern design trends, we make sure your users have a smooth experience across all devices.
        </p>
      </div>

      <div className="w-full h-auto flex flex-col md:flex-row items-center justify-center gap-20">
        <div className="p-4 h-60 flex flex-col items-start justify-between px-12 gap-2 rounded-lg bg-white/5 w-[400px]">
          <h1 className="text-lg font-semibold italic">
            What’s included in our web development services:
          </h1>
          <p>Responsive design implementation</p>
          <p>SEO-friendly coding</p>
          <p>Custom features and components</p>
          <p>Cross-browser compatibility</p>
        </div>
        <div className="p-4 h-60 flex flex-col items-start justify-between px-12 gap-2 rounded-lg bg-white/5 w-[400px]">
          <h1 className="text-lg font-semibold italic">Our Key Features</h1>
          <p>Fast loading websites</p>
          <p>Modern frameworks & tech</p>
          <p>Scalable architecture</p>
          <p>Secure & maintainable code</p>
          <p>24/7 support for technical issues</p>
        </div>
      </div>

      <h1 className="text-3xl font-semibold mt-6">Choose any package</h1>
      <div className="w-full   flex flex-wrap justify-center  gap-4 my-6">
        {
          packages.map((pkg) => {
                        if (pkg.category === "webdevelopment") {
                            const { id, title, price, description, features, pack } = pkg;
                            return (
                                <Package
                                    key={id}
                                    title={title}
                                    price={price}
                                    description={description}
                                    features={features || []}
                                    pack={pack}
                                />
                            );
                        }
                        else {
                            return null
                        }
                    })
        }
      </div>
    </div>
  );
};

export default WebDev;
