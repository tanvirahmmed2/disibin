"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiActivity, FiSearch, FiX, FiLifeBuoy, FiStar, FiBox, FiBriefcase } from "react-icons/fi";
import { FaHandshake } from "react-icons/fa";

const fmtDate = (d) =>
    d ? new Date(d).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

const getIcon = (type) => {
    switch (type) {
        case "ticket": return <FiLifeBuoy className="text-sky-500" />;
        case "review": return <FiStar className="text-amber-500" />;
        case "product": return <FiBox className="text-violet-500" />;
        case "project": return <FiBriefcase className="text-emerald-500" />;
        case "partner": return <FaHandshake className="text-indigo-500" />;
        default: return <FiActivity className="text-slate-400" />;
    }
};

const getActionBadge = (action) => {
    const map = {
        CREATE: "bg-emerald-50 text-emerald-600",
        UPDATE: "bg-sky-50 text-sky-600",
        DELETE: "bg-rose-50 text-rose-600",
        PATCH:  "bg-amber-50 text-amber-600",
    };
    return map[action?.toUpperCase()] || "bg-slate-100 text-slate-600";
};

// Builds a local activity feed from manager-accessible APIs
async function buildActivityFeed() {
    const [ticketRes, reviewRes, projectRes] = await Promise.allSettled([
        axios.get("/api/ticket"),
        axios.get("/api/review?type=all"),
        axios.get("/api/projects"),
    ]);

    const feed = [];

    if (ticketRes.status === "fulfilled" && ticketRes.value.data.success) {
        ticketRes.value.data.data.forEach(t => {
            feed.push({
                id: `ticket-${t.ticket_id}`,
                type: "ticket",
                action: t.status === "open" ? "OPEN" : t.status === "resolved" ? "RESOLVED" : t.status.toUpperCase(),
                description: `Ticket #${t.ticket_id}: ${t.subject || "Support request"}`,
                user: t.user_name || "Customer",
                date: t.created_at,
            });
        });
    }

    if (reviewRes.status === "fulfilled" && reviewRes.value.data.success) {
        reviewRes.value.data.data.forEach(r => {
            feed.push({
                id: `review-${r.review_id}`,
                type: "review",
                action: r.is_approved ? "APPROVED" : "PENDING",
                description: `${r.rating}★ review from ${r.user_name || "user"}`,
                user: r.user_name || "User",
                date: r.created_at,
            });
        });
    }

    if (projectRes.status === "fulfilled" && projectRes.value.data.success) {
        projectRes.value.data.data.forEach(p => {
            feed.push({
                id: `project-${p.project_id}`,
                type: "project",
                action: p.status?.toUpperCase() || "ACTIVE",
                description: `Project: ${p.title}`,
                user: p.creator_name || "Manager",
                date: p.created_at,
            });
        });
    }

    // Sort by date descending
    return feed.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export default function ManagerActivityPage() {
    const [feed, setFeed] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        buildActivityFeed()
            .then(setFeed)
            .catch(() => toast.error("Failed to load activity"))
            .finally(() => setLoading(false));
    }, []);

    const filtered = feed.filter(f =>
        `${f.description} ${f.user} ${f.type} ${f.action}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6 min-h-screen bg-slate-50/50">

            <div>
                <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                    <span className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center">
                        <FiActivity className="text-sky-600" size={18} />
                    </span>
                    Activity Feed
                </h1>
                <p className="text-slate-500 text-sm mt-1">Recent actions across tickets, reviews, and projects</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

                {/* Search */}
                <div className="p-4 border-b border-slate-100">
                    <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-100 max-w-md">
                        <FiSearch className="text-slate-400 shrink-0" size={15} />
                        <input
                            type="text"
                            placeholder="Search activity..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm w-full placeholder-slate-400"
                        />
                        {search && (
                            <button onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-600">
                                <FiX size={14} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-400 text-xs uppercase tracking-widest font-bold border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3 text-slate-400">
                                            <div className="w-8 h-8 border-2 border-sky-200 border-t-sky-500 rounded-full animate-spin" />
                                            <span className="text-sm">Loading activity...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3 text-slate-400">
                                            <FiActivity size={32} className="text-slate-200" />
                                            <span className="text-sm">No activity found</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.map(f => (
                                <tr key={f.id} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 font-medium text-slate-700 capitalize">
                                            {getIcon(f.type)}
                                            <span>{f.type}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs">
                                        <p className="text-slate-600 text-xs truncate" title={f.description}>{f.description}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase ${getActionBadge(f.action)}`}>
                                            {f.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 text-xs">{f.user}</td>
                                    <td className="px-6 py-4 text-slate-400 text-xs">{fmtDate(f.date)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
