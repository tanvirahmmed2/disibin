import React from "react";
import UsePageTitle from "../component/UsePageTitle";

const projectData = [
  {
    id: 1
  },
  {
    id: 2
  },
  {
    id: 3
  },
  {
    id: 4
  },
]

const Projects = () => {
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
        {projectData.map((project) => {
          const { id } = project
          return (
            <div key={id} className="relative w-[300px] h-[450px] p-2 shadow-sm shadow-indigo-500 bg-white/5 border-2 border-red-400 border-opacity-30 rounded-xl">

              <div className="absolute bottom-4 left-4">
                <a href="/" className="bg-sky-400 px-4 p-1 rounded-lg">preview</a>
              </div>
            </div>
          )
        })}
      </div>

    </section>
  );
};

export default Projects;
