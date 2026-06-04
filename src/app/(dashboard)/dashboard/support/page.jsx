"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import {
    FaTicketAlt, FaEnvelopeOpenText, FaCheckCircle, FaClock,
    FaExclamationTriangle, FaFireAlt, FaArrowRight, FaInbox,
    FaSpinner, FaChartBar, FaUserShield
} from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const STATUS_STYLES = {
    open: { label: "Open", color: "#3b82f6", bg: "#eff6ff" },
    in_progress: { label: "In Progress", color: "#f59e0b", bg: "#fffbeb" },
    resolved: { label: "Resolved", color: "#10b981", bg: "#ecfdf5" },
    closed: { label: "Closed", color: "#6b7280", bg: "#f9fafb" },
};

const PRIORITY_COLORS = {
    low: "#9ca3af", medium: "#3b82f6", high: "#f97316", urgent: "#ef4444",
};

export default function SupportDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [tickets, setTickets] = useState([]);
    const [supports, setSupports] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [ticketsRes, supportsRes] = await Promise.all([
                axios.get("/api/ticket"),
                axios.get("/api/support"),
            ]);
            if (ticketsRes.data.success) setTickets(ticketsRes.data.data);
            if (supportsRes.data.success) setSupports(supportsRes.data.data);
        } catch {}
        finally { setLoading(false); }
    };

    // Computed stats
    const ticketStats = {
        total: tickets.length,
        open: tickets.filter(t => t.status === "open").length,
        inProgress: tickets.filter(t => t.status === "in_progress").length,
        resolved: tickets.filter(t => t.status === "resolved").length,
        urgent: tickets.filter(t => t.priority === "urgent").length,
        high: tickets.filter(t => t.priority === "high").length,
    };
    const supportStats = {
        total: supports.length,
        pending: supports.filter(s => s.status === "pending").length,
        replied: supports.filter(s => s.status === "replied").length,
    };

    const recentTickets = [...tickets].slice(0, 6);
    const pendingSupports = supports.filter(s => s.status === "pending").slice(0, 4);

    const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "";

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="flex flex-col items-center gap-3 text-gray-400">
                    <FaSpinner size={28} className="animate-spin text-blue-500" />
                    <span className="text-sm font-medium">Loading dashboard...</span>
                </div>
            </div>
        );
    }

    const ticketStatusData = Object.entries(STATUS_STYLES).map(([key, style]) => ({
        name: style.label,
        value: tickets.filter(t => t.status === key).length,
        color: style.color
    })).filter(d => d.value > 0);

    const priorityData = ["urgent", "high", "medium", "low"].map(p => ({
        name: p.charAt(0).toUpperCase() + p.slice(1),
        Count: tickets.filter(t => t.priority === p).length,
        color: PRIORITY_COLORS[p]
    }));

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Support Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Overview of all tickets and contact requests</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/dashboard/support/tickets"
                        className="flex items-center gap-1.5 text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        <FaTicketAlt size={13} /> Manage Tickets
                    </Link>
                    <Link href="/dashboard/support/support"
                        className="flex items-center gap-1.5 text-sm px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                        <FaEnvelopeOpenText size={13} /> Contact Requests
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard icon={<FaTicketAlt />} label="Total Tickets" value={ticketStats.total} color="#3b82f6" bg="#eff6ff" />
                <StatCard icon={<FaClock />} label="Open" value={ticketStats.open} color="#f59e0b" bg="#fffbeb" />
                <StatCard icon={<FaCheckCircle />} label="Resolved" value={ticketStats.resolved} color="#10b981" bg="#ecfdf5" />
                <StatCard icon={<FaFireAlt />} label="Urgent" value={ticketStats.urgent} color="#ef4444" bg="#fef2f2" />
            </div>

            {/* Second row stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                            <FaChartBar size={14} />
                        </div>
                        <h3 className="font-semibold text-gray-800">Ticket Status Breakdown</h3>
                    </div>
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={ticketStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value">
                                    {ticketStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <RechartsTooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
                            <FaExclamationTriangle size={14} />
                        </div>
                        <h3 className="font-semibold text-gray-800">Priority Breakdown</h3>
                    </div>
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                                <YAxis tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                                <RechartsTooltip cursor={{fill: '#f8fafc'}} />
                                <Bar dataKey="Count" radius={[4, 4, 0, 0]}>
                                    {priorityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <FaEnvelopeOpenText size={14} />
                        </div>
                        <h3 className="font-semibold text-gray-800">Contact Requests</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <FaInbox className="text-amber-500" size={14} />
                                <span className="text-sm font-medium text-amber-700">Pending</span>
                            </div>
                            <span className="text-lg font-bold text-amber-700">{supportStats.pending}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <FaCheckCircle className="text-emerald-500" size={14} />
                                <span className="text-sm font-medium text-emerald-700">Replied</span>
                            </div>
                            <span className="text-lg font-bold text-emerald-700">{supportStats.replied}</span>
                        </div>
                        <Link href="/dashboard/support/support"
                            className="flex items-center justify-center gap-1.5 w-full text-sm text-blue-600 hover:text-blue-700 font-medium py-2 border border-blue-100 rounded-lg hover:bg-blue-50 transition-colors">
                            View All <FaArrowRight size={10} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Recent Tickets + Pending Support Requests */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {/* Recent Tickets */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            <FaTicketAlt className="text-blue-500" size={14} /> Recent Tickets
                        </h3>
                        <Link href="/dashboard/support/tickets" className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                            View all <FaArrowRight size={9} />
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {recentTickets.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 text-sm">No tickets yet</div>
                        ) : recentTickets.map(t => {
                            const s = STATUS_STYLES[t.status] || STATUS_STYLES.open;
                            return (
                                <div key={t.ticket_id} className="flex items-center justify-between p-3.5 hover:bg-gray-50 transition-colors">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">{t.subject}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{t.user_name || "User"} · {formatDate(t.created_at)}</p>
                                    </div>
                                    <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                                        <span className="text-[10px] font-semibold capitalize"
                                            style={{ color: PRIORITY_COLORS[t.priority] }}>{t.priority}</span>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                                            style={{ color: s.color, backgroundColor: s.bg }}>{s.label}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Pending Support Requests */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            <FaEnvelopeOpenText className="text-amber-500" size={14} /> Pending Contact Requests
                        </h3>
                        <Link href="/dashboard/support/support" className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                            View all <FaArrowRight size={9} />
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {pendingSupports.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 text-sm">No pending contact requests</div>
                        ) : pendingSupports.map(s => (
                            <div key={s.support_id} className="p-3.5 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">{s.subject}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{s.name} · {s.email}</p>
                                    </div>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-amber-50 text-amber-700 flex-shrink-0">Pending</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1 line-clamp-1">{s.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Nav Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/dashboard/support/tickets"
                    className="group flex items-center gap-4 p-5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <FaTicketAlt size={20} />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-lg">Ticket Management</h3>
                        <p className="text-blue-100 text-sm">Reply, assign and manage all support tickets</p>
                    </div>
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link href="/dashboard/support/support"
                    className="group flex items-center gap-4 p-5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-white hover:from-amber-600 hover:to-orange-600 transition-all shadow-sm">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <FaEnvelopeOpenText size={20} />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-lg">Contact Requests</h3>
                        <p className="text-amber-100 text-sm">Handle guest inquiries and contact form messages</p>
                    </div>
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

        </div>
    );
}

function StatCard({ icon, label, value, color, bg }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ backgroundColor: bg, color }}>
                {icon}
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">{label}</p>
            </div>
        </div>
    );
}
