import React, { useState } from "react";
import { Link } from "react-router-dom";
import UsePageTitle from "../component/UsePageTitle";

import ProjectDatas from "../data"


const Projects = () => {
const [projects, setProjects]= useState(ProjectDatas)

  UsePageTitle("Projects");
  return (
    <section className="w-full mt-20  min-h-screen p-8 flex flex-col gap-12 items-center justify-start">

      <div className="w-full  flex flex-row items-center justify-around">
        <div className="w-auto flex flex-col items-start justify-center gap-3">
          <h1 className="text-4xl font-semibold">Featured work</h1>
          <p>A few small, real-world examples.</p>
        </div>
        <div className="w-auto flex flex-row items-center gap-2">
          <button className="bg-white/10 px-4 py-1 rounded-lg hover:scale-105">All</button>
          <button className="bg-white/10 px-4 py-1 rounded-lg hover:scale-105">Filter</button>
        </div>
      </div>

      <div className="w-full grid gap-6 grid-cols-[repeat(auto-fill,minmax(300px,1fr))] justify-items-center">
        {projects.map((project) => {
          const { id, title, description, Image, category } = project
          return (
            <div key={id} className="relative w-[300px] h-[450px] p-2 shadow-sm shadow-indigo-500 bg-white/5 border-2 border-red-400 border-opacity-30 rounded-xl flex items-center justify-center">
                <img src={Image} alt="title image"  className="rounded-lg scale-110"/>
              <div className="absolute bottom-4 left-4 flex gap-3 flex-col">
                <h1 className="text-black bg-white w-full text-center rounded-lg">{title}</h1>
                <p></p>
                <div className="flex flex-row gap-4">
                  <Link to={`/projects/${title}`}className="bg-sky-400 px-4 p-1 rounded-lg">Preview</Link>
                  <p className="bg-emerald-500 px-4 p-1 rounded-lg">{category}</p>
                </div>

              </div>
            </div>
          )
        })}
      </div>

    </section>
  );
};

export default Projects;
