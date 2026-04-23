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
    <main className='w-full min-h-screen bg-white pt-20'>
      <section className='py-12 border-b border-slate-50'>
        <div className="container-custom">
            <div className="max-w-3xl">
                <span className='px-4 py-1.5 bg-emerald-500/5 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] rounded-full inline-block mb-6'>Portfolio</span>
                <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none mb-8">Selected Works<span className='text-emerald-500/50'>.</span></h1>
                <p className="text-xl text-slate-500 font-medium leading-relaxed">A curated collection of digital products, brand experiences, and technical solutions crafted with precision.</p>
            </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-[80px] z-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 py-4">
        <div className="container-custom flex items-center gap-4 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
              selectedCategory === 'all' 
              ? 'bg-slate-900 text-white shadow-lg' 
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            All Projects
          </button>
          {categories.map((cat) => (
            <button 
              key={cat.category_id}
              onClick={() => setSelectedCategory(cat.category_id.toString())}
              className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                selectedCategory === cat.category_id.toString() 
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
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
