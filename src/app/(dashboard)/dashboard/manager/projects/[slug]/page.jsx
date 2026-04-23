'use client'
import React, { useState, useEffect } from 'react'
import UpdateProjectForm from '@/component/forms/UpdateProjectForm'
import { RiArrowLeftLine } from 'react-icons/ri'
import Link from 'next/link'
import axios from 'axios'
import { useParams } from 'next/navigation'

const EditProjectPage = () => {
    const { slug } = useParams()
    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await axios.get(`/api/project`)
                const found = res.data.data.find(p => p.slug === slug)
                setProject(found)
            } catch (error) {
                console.error('Failed to fetch project', error)
            } finally {
                setLoading(false)
            }
        }
        fetchProject()
    }, [slug])

    if (loading) return <div className="p-10 text-center font-bold text-slate-400">Loading project data...</div>
    if (!project) return <div className="p-10 text-center font-bold text-red-400">Project not found.</div>

    return (
        <div className="space-y-6 py-6 px-4">
            <div className="flex flex-col gap-4">
                <Link 
                    href="/dashboard/manager/projects" 
                    className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-colors font-bold text-xs uppercase tracking-widest"
                >
                    <RiArrowLeftLine size={16} /> Back to Portfolio
                </Link>
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-800">Edit Project: {project.title}</h1>
                    <p className="text-sm text-slate-500">Update project details, links, and imagery.</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-3xl">
                <UpdateProjectForm projectData={project} />
            </div>
        </div>
    )
}

export default EditProjectPage
