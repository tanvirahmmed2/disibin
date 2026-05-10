'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { RiArrowRightLine, RiRocketLine } from 'react-icons/ri'
import ProjectCard from '../card/ProjectCard'

const LatestProjects = () => {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await axios.get('/api/project')
                setProjects(res.data.data?.slice(0, 4) || [])
            } catch (error) {
                console.error('Failed to fetch latest projects', error)
            } finally {
                setLoading(false)
            }
        }
        fetchProjects()
    }, [])

    if (loading) {
        return (
            <section className="w-full py-24 bg-white">
                <div className="container-custom px-4">
                    <div className="flex flex-col items-center justify-center min-h-100">
                        <div className="w-10 h-10 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
                    </div>
                </div>
            </section>
        )
    }

    if (projects.length === 0) return null

    return (
        <section className="w-full py-24 bg-white border-b border-slate-100">
            <div className="container-custom px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
                    <div className="max-w-2xl space-y-6">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-slate-50 text-slate-600 rounded-full text-[9px] font-semibold uppercase tracking-[0.2em] border border-slate-100">
                            <RiRocketLine size={14} /> Proven Results
                        </div>
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tighter"
                        >
                            Latest <span className="text-emerald-500">Creations.</span>
                        </motion.h2>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-lg text-slate-500 font-medium leading-relaxed"
                        >
                            Take a look at some of our most recent technical achievements and digital success stories.
                        </motion.p>
                    </div>
                    
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Link 
                            href="/projects" 
                            className="group inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 shadow-sm"
                        >
                            View Portfolio
                            <RiArrowRightLine size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                    {projects.map((project) => (
                         <ProjectCard 
                            project={{ ...project, id: project.project_id }} 
                            key={project.project_id}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default LatestProjects
