"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiPieChart, FiUsers, FiBriefcase, FiActivity, FiLifeBuoy, FiLock } from "react-icons/fi";

export default function ManagerAnalyticsPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [denied, setDenied] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axios.get("/api/analytics");
                if (res.data.success) setData(res.data.data);
                else setDenied(true);
            } catch (err) {
                if (err.response?.status === 403) setDenied(true);
                else toast.error("Failed to fetch analytics");
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500" />
        </div>
    );

    if (denied) return (
        <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center">
                <FiLock className="text-slate-400" size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-700">Admin Access Required</h2>
            <p className="text-slate-400 text-sm max-w-sm">
                Full analytics is restricted to administrators. Contact your admin for platform-wide stats.
            </p>
        </div>
    );

    const stats = [
        { label: "Total Users", value: data?.totalUsers ?? 0, icon: FiUsers, color: "bg-blue-500" },
        { label: "Active Projects", value: data?.activeProjects ?? 0, icon: FiBriefcase, color: "bg-emerald-500" },
        { label: "Pending Tasks", value: data?.pendingTasks ?? 0, icon: FiActivity, color: "bg-amber-500" },
        { label: "Open Tickets", value: data?.openTickets ?? 0, icon: FiLifeBuoy, color: "bg-rose-500" },
    ];

    return (
        <div className="p-6 space-y-6 min-h-screen bg-slate-50/50">
            <div>
                <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                    <span className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center">
                        <FiPieChart className="text-violet-600" size={18} />
                    </span>
                    Analytics Overview
                </h1>
                <p className="text-slate-500 text-sm mt-1">Platform performance and statistics</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(s => (
                    <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${s.color}`}>
                            <s.icon size={18} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-400">{s.label}</p>
                            <p className="text-2xl font-extrabold text-slate-900">{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
