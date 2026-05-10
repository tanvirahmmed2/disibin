'use client'
import ProjectCard from '@/component/card/ProjectCard'
import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'

const ProjectsPage = () => {
  const [projects, setProjects] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, catRes] = await Promise.all([
          axios.get('/api/project'),
          axios.get('/api/category')
        ])
        setProjects(projRes.data.data || [])
        setCategories(catRes.data.data || [])
      } catch (error) {
        console.error('Failed to fetch projects or categories', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'all') return projects
    return projects.filter(p => p.category_id?.toString() === selectedCategory)
  }, [projects, selectedCategory])

  if (loading) return (
    <div className='w-full min-h-[60vh] flex items-center justify-center bg-slate-50'>
      <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
    </div>
  )

  return (
    <main className='w-full min-h-screen bg-slate-50 pt-24 pb-20'>

      {/* Hero */}
      <section className='mb-12'>
        <div className="container-custom px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-semibold uppercase tracking-[0.2em] border border-emerald-100">
                Portfolio Gallery
              </div>
              <h1 className="text-6xl md:text-8xl font-bold text-slate-900 tracking-tighter leading-[0.85]">
                Selected <span className="text-emerald-500">Works.</span>
              </h1>
              <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">
                A curated collection of digital products, brand experiences, and technical solutions crafted with precision and purpose.
              </p>
            </div>
            <div className="hidden lg:block pb-4">
              <div className="flex flex-col items-end gap-2 text-slate-300 font-semibold text-[10px] uppercase tracking-[0.3em]">
                <span>Case Studies</span>
                <div className="w-12 h-px bg-slate-200" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter Select */}
      {categories.length > 0 && (
        <section className="sticky top-[72px] z-20 bg-white/80 backdrop-blur-xl border-y border-slate-100 py-4 mb-12">
          <div className="container-custom px-4 flex items-center gap-4">
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400 whitespace-nowrap">Filter By</span>
            <div className="relative w-full max-w-xs">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-slate-800 appearance-none focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all cursor-pointer"
              >
                <option value="all">All Projects</option>
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id.toString()}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Projects Grid */}
      <section className='py-4 w-full'>
        <div className='container-custom px-4'>
          {filteredProjects.length === 0 ? (
            <div className="p-20 text-center border border-slate-100 bg-white rounded-2xl">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No Projects Found</h3>
              <p className="text-slate-500 font-medium">
                {projects.length === 0
                  ? 'We are busy building amazing things. Come back soon!'
                  : 'No projects match the selected filter.'}
              </p>
            </div>
          ) : (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-6">
                Showing {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
              </p>
              <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.project_id} project={{...project, id: project.project_id}}/>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

    </main>
  )
}

export default ProjectsPage
