import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import ProjectsData from "../data";
import UsePageTitle from "../component/UsePageTitle"

const Project = () => {
    const { title } = useParams();
    const [project, setProject] = useState([]);

    useEffect(() => {
        const data = ProjectsData.filter((p) => p.title === title);
        setProject(data);
    }, [title]);
    UsePageTitle(title)

    return (
        <div className="min-h-screen w-full pt-28 p-4 flex flex-col items-center justify-center gap-12">
            <h1 className="text-4xl font-bold text-center mb-10">{title}</h1>

            {project.map(
                ({
                    id,
                    category,
                    title,
                    description,
                    homeImage,
                    productImage,
                    contactImage,
                    userImage,
                    serviceImage,
                    siteUrl,
                    githubUrl,
                }) => (
                    <div
                        className="w-full flex flex-col gap-8 items-center text-center mb-12"
                        key={id}
                    >
                        <h2 className="text-2xl italic font-semibold text-gray-700">
                            {category}
                        </h2>
                        <a
                            href={siteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex justify-center"
                        >
                            <img
                                src={homeImage}
                                alt={title}
                                className="w-4/5 md:w-1/2 shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer rounded-2xl"
                            />
                        </a>

                        <p className="text-lg text-gray-600 max-w-3xl">{description}</p>

                        {/* Sections */}
                        {[
                            { label: "Product Showcase", img: productImage },
                            { label: "Services", img: serviceImage },
                            { label: "User Page", img: userImage },
                            { label: "Contact", img: contactImage },
                        ].map(({ label, img }, idx) => (
                            <div key={idx} className="w-full flex flex-col gap-3 items-center">
                                <p className="text-2xl font-mono">{label}</p>
                                <a
                                    href={siteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex justify-center"
                                >
                                    <img
                                        src={img}
                                        alt={label}
                                        className="w-4/5 md:w-1/2 shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer rounded-2xl"
                                    />
                                </a>
                            </div>
                        ))}

                        {/* Buttons */}
                        <div className="flex gap-4 mt-6">
                            <a
                                href={siteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-2 bg-red-500 text-white rounded-xl hover:scale-105 shadow-md shadow-red-400 transition"
                            >
                                View Site
                            </a>
                            <a
                                href={githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-2 bg-emerald-500 text-white rounded-xl hover:scale-105 shadow-md shadow-emerald-400 transition"
                            >
                                Code
                            </a>
                        </div>

                        {/* Divider */}
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ duration: 1 }}
                            className="w-3/4 h-[2px] bg-red-700 mt-8"
                        ></motion.div>
                    </div>
                )
            )}
        </div>
    );
};

export default Project;
