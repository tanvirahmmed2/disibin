import ProjectCard from '@/component/card/ProjectCard'
import { BASE_URL } from '@/lib/database/secret'
import React from 'react'

const ProjectsPage = async () => {
  const res = await fetch(`${BASE_URL}/api/project`, {
    method: 'GET',
    cache: 'no-store'
  })

  const data = await res.json()

  if (!data.success) return (
    <div className='w-full min-h-[60vh] flex items-center justify-center bg-slate-50'>
      <div className="card-premium p-12 text-center text-slate-500 font-medium">
        Failed to load projects.
      </div>
    </div>
  )
  const projects = data.payload

  return (
    <div className='w-full min-h-screen bg-slate-50 py-20'>
      <div className="container-custom">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Our Portfolio</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">Explore our successful projects and digital transformations.</p>
          <div className="w-24 h-1.5 bg-emerald-500 rounded-full mx-auto mt-8 shadow-lg shadow-emerald-200"></div>
        </div>

        {projects.length === 0 ? (
          <div className="card-premium p-16 text-center">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">No Projects Found</h3>
            <p className="text-slate-500">We are busy building amazing things. Come back soon!</p>
          </div>
        ) : (
          <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {projects.map((project) => (
              <ProjectCard key={project.project_id} project={project}/>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectsPage

