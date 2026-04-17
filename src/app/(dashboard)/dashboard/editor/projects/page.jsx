'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { RiAddLine } from 'react-icons/ri'
import { MdDeleteOutline, MdEditDocument } from 'react-icons/md'

const EditorProjects = () => {
    const [projects, setProjects] = useState([])
    const [loading, setLoading]= useState(true)

    const fetchProjects = async () => {
        try {
            const res = await axios.get('/api/project', { withCredentials: true })
            setProjects(res.data.payload || [])
        } catch (error) {
            console.error('Failed to fetch projects', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return
        try {
            await axios.delete('/api/project', { data: { id }, withCredentials: true })
            fetchProjects()
        } catch (error) {
            alert('Failed to delete project')
        }
    }

    useEffect(() => {
        fetchProjects()
    }, [])

   

    return (
        <div className="space-y-8 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Projects</h1>
                    <p className="text-slate-500 font-medium">Manage and exhibit the project case studies.</p>
                </div>
                <Link href="/dashboard/editor/projects/new" className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-slate-900/10 hover:bg-emerald-500 transition-all active:scale-95">
                    <RiAddLine size={24} />
                    <span>New Project</span>
                </Link>
            </div>

            {
                projects.length===0?<div className='w-full h-full flex items-center justify-center p-20 font-semibold'>
                    <p>No project found</p>
                </div>:<div className='w-full flex flex-col items-center gap-1 font-semibold'>
                    <div className='w-full flex flex-row items-center justify-between bg-emerald-100 rounded-t-2xl p-4 '>
                        <p>Title</p>
                        <p>Actions</p>
                    </div>
                    {
                        projects.map((project)=>(
                            <div key={project._id} className='w-full flex flex-row items-center justify-between p-4 shadow even:bg-slate-100'>
                                <p>{project.title}</p>
                                <div className='w-auto flex flex-row items-center justify-center gap-4 text-xl'>
                                    <Link href={`/dashboard/editor/projects/${project.slug}`}><MdEditDocument/></Link>
                                    <button onClick={()=>handleDelete(project._id)}><MdDeleteOutline/></button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            }

            
        </div>
    )
}

export default EditorProjects
