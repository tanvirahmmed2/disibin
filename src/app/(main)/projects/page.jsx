'use client'
import ProjectCard from '@/component/card/ProjectCard'
import React, { useState, useEffect } from 'react'
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

  if (loading) return (
    <div className='w-full min-h-[60vh] flex items-center justify-center bg-slate-50'>
      <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
    </div>
  )

  const filteredCategories = selectedCategory === 'all' 
    ? categories 
    : categories.filter(cat => cat.category_id.toString() === selectedCategory)

  const uncategorizedProjects = projects.filter(p => !p.category_id)

  return (
    <main className='w-full min-h-screen bg-slate-50 pt-24 pb-20'>
      {/* Header Section */}
      <section className='mb-20'>
        <div className="container-custom px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="max-w-3xl space-y-6">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-emerald-500/10 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-emerald-500/10">
                    Portfolio Gallery
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.85]">
                  Selected <span className="text-emerald-500">Works.</span>
                </h1>
                <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">
                  A curated collection of digital products, brand experiences, and technical solutions crafted with precision and purpose.
                </p>
            </div>
            <div className="hidden lg:block pb-4">
                <div className="flex flex-col items-end gap-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">
                    <span>Case Studies</span>
                    <div className="w-12 h-0.5 bg-slate-200" />
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-[80px] z-20 bg-white/60 backdrop-blur-2xl border-y border-slate-100 py-6 mb-16 shadow-sm">
        <div className="container-custom px-4 flex items-center gap-6 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setSelectedCategory('all')}
            className={`px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
              selectedCategory === 'all' 
              ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10' 
              : 'bg-transparent text-slate-500 hover:text-emerald-600'
            }`}
          >
            All Projects
          </button>
          {categories.map((cat) => (
            <button 
              key={cat.category_id}
              onClick={() => setSelectedCategory(cat.category_id.toString())}
              className={`px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-300 ${
                selectedCategory === cat.category_id.toString() 
                ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' 
                : 'bg-transparent text-slate-500 hover:text-emerald-600'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      <section className='py-12 bg-slate-50/30 w-full'>
        <div className='container-custom space-y-20'>
            {filteredCategories.map((cat) => {
              const catProjects = projects.filter(p => p.category_id === cat.category_id)
              if (catProjects.length === 0) return null
              return (
                <div key={cat.category_id} className="space-y-8">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{cat.name}</h2>
                    <div className="h-[2px] flex-1 bg-slate-100"></div>
                  </div>
                  <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {catProjects.map((project) => (
                      <ProjectCard key={project.project_id} project={{...project, id: project.project_id}}/>
                    ))}
                  </div>
                </div>
              )
            })}

            {/* Uncategorized Section */}
            {(selectedCategory === 'all' && uncategorizedProjects.length > 0) && (
               <div className="space-y-8">
               <div className="flex items-center gap-4">
                 <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Other Projects</h2>
                 <div className="h-[2px] flex-1 bg-slate-100"></div>
               </div>
               <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                 {uncategorizedProjects.map((project) => (
                   <ProjectCard key={project.project_id} project={{...project, id: project.project_id}}/>
                 ))}
               </div>
             </div>
            )}

            {projects.length === 0 && (
              <div className="p-24 text-center border-2 border-dashed border-slate-200 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-slate-900 mb-2">No Projects Found</h3>
                  <p className="text-slate-500 font-medium">We are busy building amazing things. Come back soon!</p>
              </div>
            )}
        </div>
      </section>
    </main>
  )
}

export default ProjectsPage
