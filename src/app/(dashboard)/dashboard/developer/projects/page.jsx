"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import { FaBriefcase, FaCalendarAlt, FaCheckCircle } from "react-icons/fa";

export default function DeveloperProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
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

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">My Projects</h1>
                <p className="text-sm text-slate-500 mt-1">Projects you are assigned to</p>
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
                    <h3 className="text-lg font-semibold text-slate-700">No Projects Assigned</h3>
                    <p className="text-slate-500 text-sm mt-1 max-w-sm text-center">You haven't been assigned to any projects yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <Link key={project.project_id} href={`/dashboard/developer/projects/${project.project_id}`} className="group block">
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
                                        <span className="text-slate-400 font-medium">My Tasks</span>
                                        <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                                            <FaCheckCircle className="text-blue-500" /> 
                                            {project.my_tasks || 0}
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex flex-col gap-1">
                                        <span className="text-slate-400 font-medium">Deadline</span>
                                        <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                                            <FaCalendarAlt className="text-orange-500" />
                                            {project.deadline ? new Date(project.deadline).toLocaleDateString() : "None"}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-3">
                                    Created on {new Date(project.created_at).toLocaleDateString()} by {project.creator_name}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
