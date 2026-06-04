"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import {
    FiLifeBuoy, FiStar, FiBriefcase, FiBox,
    FiArrowRight, FiTrendingUp, FiClock, FiCheckCircle,
    FiPieChart, FiHandshake
} from "react-icons/fi";

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${color}`}>
            <Icon size={18} />
        </div>
        <div>
            <p className="text-sm font-medium text-slate-400">{label}</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-0.5">{value}</p>
            {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
    </div>
);

const NavCard = ({ href, icon: Icon, title, desc, color }) => (
    <Link href={href}
        className="group bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md hover:border-sky-200 transition-all duration-200">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 ${color}`}>
            <Icon size={20} />
        </div>
        <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors">{title}</p>
            <p className="text-xs text-slate-400 mt-0.5 truncate">{desc}</p>
        </div>
        <FiArrowRight className="text-slate-300 group-hover:text-sky-500 group-hover:translate-x-1 transition-all" />
    </Link>
);

export default function ManagerDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [ticketRes, reviewRes, projectRes] = await Promise.allSettled([
                    axios.get("/api/ticket"),
                    axios.get("/api/review?type=all"),
                    axios.get("/api/projects"),
                ]);

                const tickets = ticketRes.status === "fulfilled" && ticketRes.value.data.success
                    ? ticketRes.value.data.data : [];
                const reviews = reviewRes.status === "fulfilled" && reviewRes.value.data.success
                    ? reviewRes.value.data.data : [];
                const projects = projectRes.status === "fulfilled" && projectRes.value.data.success
                    ? projectRes.value.data.data : [];

                setStats({
                    openTickets: tickets.filter(t => t.status === "open").length,
                    totalTickets: tickets.length,
                    pendingReviews: reviews.filter(r => !r.is_approved).length,
                    totalReviews: reviews.length,
                    activeProjects: projects.filter(p => p.status === "active").length,
                    totalProjects: projects.length,
                });
            } catch {
                toast.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const navLinks = [
        { href: "/dashboard/manager/analytics", icon: FiPieChart, title: "Analytics", desc: "Platform stats & charts", color: "bg-violet-500" },
        { href: "/dashboard/manager/projects", icon: FiBriefcase, title: "Projects", desc: "Internal project management", color: "bg-blue-500" },
        { href: "/dashboard/manager/products", icon: FiBox, title: "Products", desc: "Manage product catalogue", color: "bg-amber-500" },
        { href: "/dashboard/manager/reviews", icon: FiStar, title: "Reviews", desc: "Approve or moderate feedback", color: "bg-emerald-500" },
        { href: "/dashboard/manager/tickets", icon: FiLifeBuoy, title: "Tickets", desc: "Customer support tickets", color: "bg-sky-500" },
        { href: "/dashboard/manager/partners", icon: FiHandshake, title: "Partners", desc: "Collaboration logos on homepage", color: "bg-indigo-500" },
        { href: "/dashboard/manager/activity", icon: FiTrendingUp, title: "Activity", desc: "Recent platform actions", color: "bg-rose-500" },
    ];

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Manager Dashboard</h1>
                <p className="text-slate-500 text-sm mt-1">Your operational overview</p>
            </div>

            {/* Stats */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 h-28 animate-pulse bg-slate-50" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard icon={FiLifeBuoy} label="Open Tickets" value={stats?.openTickets ?? "—"} sub={`${stats?.totalTickets ?? 0} total`} color="bg-sky-500" />
                    <StatCard icon={FiClock} label="Pending Reviews" value={stats?.pendingReviews ?? "—"} sub={`${stats?.totalReviews ?? 0} total`} color="bg-amber-500" />
                    <StatCard icon={FiCheckCircle} label="Active Projects" value={stats?.activeProjects ?? "—"} sub={`${stats?.totalProjects ?? 0} total`} color="bg-emerald-500" />
                </div>
            )}

            {/* Navigation cards */}
            <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3">Quick Access</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {navLinks.map(l => <NavCard key={l.href} {...l} />)}
                </div>
            </div>
        </div>
    );
}
