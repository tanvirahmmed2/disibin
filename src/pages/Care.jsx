import React, { useContext } from "react";
import { CreateContext } from "../component/Context/CreateContext";
import Package from "./Package";
import UsePageTitle from '../component/UsePageTitle';

const Care = () => {
    UsePageTitle("Care Plans");
    const { packages } = useContext(CreateContext);

    // Find the 'care' category
    const careCategory = packages?.find(cat => cat.category === "care");

    // Get packages array safely
    const carePackages = careCategory?.packages || [];

    return (
        <div className="w-full my-14 p-4 h-auto flex flex-col gap-6 items-center justify-center">
            <div className="w-full flex text-center flex-col items-center justify-center gap-4">
                <h1 className="text-3xl font-semibold">IT Care Plans</h1>
                <p>Our IT Care Plans keep your business systems secure and optimized. From basic monitoring to full IT management, we provide support to ensure your IT infrastructure runs smoothly and efficiently.</p>
            </div>

            <div className="w-full h-auto flex flex-col lg:flex-row items-center justify-center gap-20">
                <div className="p-4 h-60 flex flex-col items-start justify-between px-12 gap-2 rounded-lg bg-white/5 w-[400px]">
                    <h1 className="text-lg font-semibold italic">What’s included in our IT care services:</h1>
                    <p>Regular security updates</p>
                    <p>Website and system monitoring</p>
                    <p>Email & chat support</p>
                    <p>Backups and disaster recovery</p>
                </div>
                <div className="p-4 h-60 flex flex-col items-start justify-between px-12 gap-2 rounded-lg bg-white/5 w-[400px]">
                    <h1 className="text-lg font-semibold italic">Our Key Features</h1>
                    <p>24/7 system monitoring</p>
                    <p>Dedicated IT support</p>
                    <p>Priority response times</p>
                    <p>Performance optimization</p>
                    <p>Customized IT solutions</p>
                </div>
            </div>

            <h1 className="text-3xl font-semibold mt-6">Choose any package</h1>
            <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] justify-items-center gap-12 my-6">
                {carePackages.map(pkg => {
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
                })}
            </div>
        </div>
    );
};

export default Care;
