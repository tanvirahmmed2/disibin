"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import { FiBriefcase, FiActivity, FiCheckCircle, FiClock, FiAlertCircle, FiArrowRight, FiMessageSquare } from "react-icons/fi";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 ${color}`}>
            <Icon size={18} />
        </div>
        <div>
            <p className="text-xs font-medium text-slate-400">{label}</p>
            <p className="text-2xl font-extrabold text-slate-900">{value}</p>
        </div>
    </div>
);

export default function DeveloperDashboard() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("/api/projects")
            .then(res => { if (res.data.success) setProjects(res.data.data); })
            .catch(() => toast.error("Failed to load projects"))
            .finally(() => setLoading(false));
    }, []);

    const totalTasks = projects.reduce((acc, p) => acc + Number(p.my_tasks || 0), 0);
    const completedTasks = projects.reduce((acc, p) => acc + Number(p.completed_tasks || 0), 0);
    const activeProjects = projects.filter(p => p.status === "active").length;

    const navLinks = [
        { href: "/dashboard/developer/projects", icon: FiBriefcase, title: "My Projects", desc: "View all assigned projects", color: "bg-blue-500" },
        { href: "/dashboard/developer/tasks", icon: FiActivity, title: "My Tasks", desc: "Manage your task assignments", color: "bg-emerald-500" },
        { href: "/dashboard/chat", icon: FiMessageSquare, title: "Internal Chat", desc: "Communicate with your team", color: "bg-violet-500" },
    ];

    const projectStatusData = [
        { name: "Active", value: activeProjects, color: "#f59e0b" },
        { name: "Completed", value: projects.filter(p => p.status === "completed").length, color: "#10b981" },
        { name: "On Hold", value: projects.filter(p => p.status === "on_hold").length, color: "#94a3b8" }
    ].filter(d => d.value > 0);

    const taskChartData = projects.slice(0, 5).map(p => ({
        name: p.title.length > 15 ? p.title.substring(0, 15) + '...' : p.title,
        Completed: Number(p.completed_tasks || 0),
        Pending: Number(p.total_tasks || 0) - Number(p.completed_tasks || 0)
    }));

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">

            <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Developer Workspace</h1>
                <p className="text-slate-500 text-sm mt-1">Your assigned projects and tasks</p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 h-20 animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard icon={FiBriefcase} label="Active Projects" value={activeProjects} color="bg-blue-500" />
                    <StatCard icon={FiClock} label="My Total Tasks" value={totalTasks} color="bg-amber-500" />
                    <StatCard icon={FiCheckCircle} label="Completed Tasks" value={completedTasks} color="bg-emerald-500" />
                </div>
            )}

            {/* Quick nav */}
            <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Quick Access</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {navLinks.map(l => (
                        <Link key={l.href} href={l.href}
                            className="group bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md hover:border-sky-200 transition-all">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 ${l.color}`}>
                                <l.icon size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors">{l.title}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{l.desc}</p>
                            </div>
                            <FiArrowRight className="text-slate-300 group-hover:text-sky-500 group-hover:translate-x-1 transition-all" />
                        </Link>
                    ))}
                </div>
            </div>

            {/* Charts Section */}
            {!loading && projects.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Project Status</h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={projectStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {projectStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Tasks per Project</h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={taskChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                                    <YAxis tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                                    <RechartsTooltip cursor={{fill: '#f8fafc'}} />
                                    <Legend wrapperStyle={{fontSize: 12}} />
                                    <Bar dataKey="Completed" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                                    <Bar dataKey="Pending" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* Recent projects preview */}
            {!loading && projects.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Recent Projects</h2>
                        <Link href="/dashboard/developer/projects" className="text-xs text-sky-500 hover:text-sky-600 font-semibold flex items-center gap-1">
                            View all <FiArrowRight size={12} />
                        </Link>
                    </div>
                    <div className="space-y-2">
                        {projects.slice(0, 4).map(p => (
                            <Link key={p.project_id} href={`/dashboard/developer/projects/${p.project_id}`}
                                className="group flex items-center gap-4 bg-white rounded-xl border border-slate-100 shadow-sm px-5 py-3.5 hover:shadow-md hover:border-sky-200 transition-all">
                                <div className={`w-2 h-2 rounded-full shrink-0 ${p.status === "active" ? "bg-amber-400" : p.status === "completed" ? "bg-emerald-400" : "bg-slate-300"}`} />
                                <p className="font-semibold text-slate-800 group-hover:text-sky-600 transition-colors flex-1 truncate">{p.title}</p>
                                <span className="text-xs text-slate-400 shrink-0">{p.my_tasks ?? 0} task{p.my_tasks !== 1 ? "s" : ""}</span>
                                {p.status === "active" && (
                                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 shrink-0">Active</span>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
