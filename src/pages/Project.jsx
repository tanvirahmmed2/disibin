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
                        <h2 className="text-2xl italic font-semibold text-white/70">
                            Category: {category}
                        </h2>
                        <a
                            href={siteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-3/4 flex justify-center"
                        >
                            <img
                                src={homeImage}
                                alt={title}
                                className="w-full  shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer rounded-2xl"
                            />
                        </a>

                        <p className="text-lg text-white opacity-70 w-3/4">{description}</p>

                        {/* Sections */}
                        {[
                            { label: "Page", img: productImage },
                            { label: "Page", img: serviceImage },
                            { label: "Page", img: userImage },
                            { label: "Page", img: contactImage },
                        ].map(({ label, img }, idx) => (
                            <div key={idx} className="w-full flex flex-col gap-6 items-center">
                                <p className="text-4xl font-semibold">{label}</p>
                                <a
                                    href={siteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-3/4 flex justify-center"
                                >
                                    <img
                                        src={img}
                                        alt={label}
                                        className="w-full  shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer rounded-2xl"
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
                                className="px-6 py-2  text-white rounded-xl hover:scale-105 shadow-sm shadow-red-400 transition"
                            >
                                View Site
                            </a>
                            <a
                                href={githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-2  text-white rounded-xl hover:scale-105 shadow-sm shadow-emerald-400 transition"
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
