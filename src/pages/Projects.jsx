import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UsePageTitle from "../component/UsePageTitle";
import ProjectDatas from "../data";

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    setProjects(ProjectDatas);
  }, []);

  UsePageTitle("Projects");

  return (
    <section className="w-full mt-20 min-h-screen p-8 flex flex-col gap-12 items-center justify-start">
      
      {/* Header */}
      <div className="w-full flex flex-row items-center justify-around">
        <div className="flex flex-col items-start gap-3">
          <h1 className="text-4xl font-semibold">Featured Work</h1>
          <p className="text-gray-400">A few small, real-world examples.</p>
        </div>
        <div className="flex flex-row items-center gap-2">
          <button className="bg-white/10 px-4 py-1 rounded-lg hover:scale-105 transition">
            All
          </button>
          <button className="bg-white/10 px-4 py-1 rounded-lg hover:scale-105 transition">
            Filter
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="w-full grid gap-6 grid-cols-[repeat(auto-fill,minmax(300px,1fr))] justify-items-center">
        {projects.map((project) => {
          const { id, title, Image, category } = project;
          return (
            <div
              key={id}
              className="relative w-[300px] h-[450px] p-2 bg-white/5 border border-gray-300/30 rounded-xl shadow-lg flex items-center justify-center overflow-hidden group"
            >
              {/* Project Image */}
              <img
                src={Image}
                alt={title}
                className="rounded-lg w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />

              {/* Overlay Info */}
              <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-3">
                <h1 className="text-black bg-white py-1 px-2 text-center rounded-lg font-semibold">
                  {title}
                </h1>
                <div className="flex flex-row gap-4">
                  <Link
                    to={`/projects/${id}`}
                    className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-1 rounded-lg transition"
                  >
                    Preview
                  </Link>
                  <span className="bg-emerald-500 text-white px-4 py-1 rounded-lg">
                    {category}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Projects;
