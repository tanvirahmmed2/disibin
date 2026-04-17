'use client'
import React, { useState, useEffect } from 'react'
import UpdateProjectForm from '@/component/forms/UpdateProjectForm' // Ensure you create this form
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
                const res = await axios.get(`/api/project/${slug}`)
                if (res.data.success) {
                    setProject(res.data.payload) 
                }
            } catch (error) {
                console.error('Failed to fetch project', error)
            } finally {
                setLoading(false)
            }
        }
        
        if (slug) fetchProject()
    }, [slug])

    if (loading) return (
        <div className="flex items-center justify-center min-h-100">
            <div className="w-12 h-12 border-4 border-slate-50 border-t-primary rounded-full animate-spin"></div>
        </div>
    )

    if (!project) return (
        <div className="p-10 text-center font-bold text-slate-400 uppercase tracking-widest">
            Project Not Found
        </div>
    )

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4">
                <Link 
                    href="/dashboard/editor/projects" 
                    className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-bold text-xs uppercase tracking-widest"
                >
                    <RiArrowLeftLine size={16} /> Back to Projects
                </Link>
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Modify Project</h1>
                    <p className="text-slate-500 font-medium">Update the details, category, or preview image of this project.</p>
                </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm">
                
                <UpdateProjectForm project={project} />
            </div>
        </div>
    )
}

export default EditProjectPage