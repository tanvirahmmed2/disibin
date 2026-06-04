"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import { FaPlus, FaBriefcase, FaCalendarAlt, FaCheckCircle, FaSpinner, FaUsers } from "react-icons/fa";

export default function ManagerProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    
    // New project state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState("");
    const [developers, setDevelopers] = useState([]);
    const [selectedDevs, setSelectedDevs] = useState([]);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchProjects();
        fetchDevelopers();
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/projects");
            if (res.data.success) {
                setProjects(res.data.data);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load projects");
        } finally {
            setLoading(false);
        }
    };

    const fetchDevelopers = async () => {
        try {
            const res = await axios.get("/api/user/management");
            if (res.data.success) {
                const devs = res.data.data.filter(u => u.role === "developer");
                setDevelopers(devs);
            }
        } catch (error) {
            console.error("Failed to load developers", error);
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        if (!title) return toast.error("Title is required");

        setCreating(true);
        try {
            const payload = {
                title,
                description,
                deadline: deadline || null,
                assigned_developers: selectedDevs
            };
            const res = await axios.post("/api/projects", payload);
            if (res.data.success) {
                toast.success(res.data.message);
                setShowModal(false);
                setTitle("");
                setDescription("");
                setDeadline("");
                setSelectedDevs([]);
                fetchProjects();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create project");
        } finally {
            setCreating(false);
        }
    };

    const toggleDev = (id) => {
        setSelectedDevs(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Projects</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage internal development projects</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm text-sm"
                >
                    <FaPlus size={12} /> New Project
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20 text-slate-400">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full" />
                </div>
            ) : projects.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-100 p-12 flex flex-col items-center justify-center shadow-sm">
                    <div className="w-16 h-16 bg-blue-50 text-blue-300 rounded-full flex items-center justify-center mb-4">
                        <FaBriefcase size={28} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700">No Projects Found</h3>
                    <p className="text-slate-500 text-sm mt-1 max-w-sm text-center">Get started by creating your first internal project and assigning developers.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <Link key={project.project_id} href={`/dashboard/manager/projects/${project.project_id}`} className="group block">
                            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all h-full flex flex-col hover:border-blue-300">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">{project.title}</h3>
                                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${
                                        project.status === 'active' ? 'bg-amber-100 text-amber-700' :
                                        project.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                        'bg-slate-100 text-slate-600'
                                    }`}>
                                        {project.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
                                    {project.description || "No description provided."}
                                </p>
                                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex flex-col gap-1">
                                        <span className="text-slate-400 font-medium">Tasks</span>
                                        <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                                            <FaCheckCircle className="text-emerald-500" /> 
                                            {project.completed_tasks || 0} / {project.total_tasks || 0}
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex flex-col gap-1">
                                        <span className="text-slate-400 font-medium">Deadline</span>
                                        <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                                            <FaCalendarAlt className="text-blue-500" />
                                            {project.deadline ? new Date(project.deadline).toLocaleDateString() : "None"}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-3">
                                    Created on {new Date(project.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><FaBriefcase size={14} /></div>
                                Create New Project
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 transition">
                               ✕
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                            <form id="createProjectForm" onSubmit={handleCreateProject} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Project Title <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" required
                                        value={title} onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                        placeholder="e.g. Disibin Mobile App"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                                    <textarea 
                                        value={description} onChange={(e) => setDescription(e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm resize-none"
                                        placeholder="Brief overview of the project..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Deadline</label>
                                    <input 
                                        type="date"
                                        value={deadline} onChange={(e) => setDeadline(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex justify-between items-center">
                                        <span>Assign Developers</span>
                                        <span className="text-xs font-normal text-slate-500">{selectedDevs.length} selected</span>
                                    </label>
                                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 max-h-40 overflow-y-auto custom-scrollbar">
                                        {developers.length === 0 ? (
                                            <div className="p-4 text-center text-sm text-slate-400">No developers found.</div>
                                        ) : (
                                            developers.map(dev => (
                                                <div 
                                                    key={dev.user_id} 
                                                    onClick={() => toggleDev(dev.user_id)}
                                                    className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all border ${
                                                        selectedDevs.includes(dev.user_id) ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-transparent hover:bg-slate-100 text-slate-700'
                                                    }`}
                                                >
                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedDevs.includes(dev.user_id) ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'}`}>
                                                        {selectedDevs.includes(dev.user_id) && <span className="text-[10px]">✓</span>}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium">{dev.name}</p>
                                                        <p className="text-xs opacity-70">{dev.email}</p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>
                        
                        <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
                            <button 
                                type="button" onClick={() => setShowModal(false)}
                                className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" form="createProjectForm" disabled={creating}
                                className="px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {creating ? <><FaSpinner className="animate-spin" /> Creating...</> : "Create Project"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
