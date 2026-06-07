"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
    FaEnvelopeOpenText, FaCheckCircle, FaTrash, FaSpinner,
    FaSearch, FaInbox, FaUserTie, FaRegEnvelope, FaTimes, FaPaperPlane, FaArrowLeft
} from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";

// ── Support Inbox ────────────────────────────────────────────────────────────
// Handles the `supports` table — guest contact form submissions.
// Staff can read, reply (stores reply text), and delete requests.
// This is SEPARATE from the Tickets system (/dashboard/support/tickets).

export default function SupportsManagement() {
    const [supports, setSupports]           = useState([]);
    const [loading, setLoading]             = useState(true);
    const [filter, setFilter]               = useState("all");
    const [search, setSearch]               = useState("");
    const [selected, setSelected]           = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const [replyText, setReplyText]         = useState("");
    const [replyLoading, setReplyLoading]   = useState(false);

    useEffect(() => { fetchSupports(); }, []);

    const fetchSupports = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/support");
            if (res.data.success) setSupports(res.data.data);
        } catch { toast.error("Failed to load contact requests"); }
        finally { setLoading(false); }
    };

    const openRequest = async (s) => {
        setSelected(s);
        setReplyText(s.reply || "");
    };

    const sendReply = async () => {
        if (!replyText.trim()) return toast.error("Reply cannot be empty");
        setReplyLoading(true);
        try {
            const res = await axios.patch(`/api/support/${selected.support_id}`, { reply: replyText.trim() });
            if (res.data.success) {
                toast.success("Reply saved & request marked as replied");
                const updated = res.data.data;
                setSupports(prev => prev.map(s => s.support_id === updated.support_id ? updated : s));
                setSelected(updated);
            } else toast.error(res.data.message);
        } catch { toast.error("Failed to save reply"); }
        finally { setReplyLoading(false); }
    };

    const markReplied = async (id) => {
        setActionLoading(id + "_reply");
        try {
            const res = await axios.patch(`/api/support/${id}`, {});
            if (res.data.success) {
                toast.success("Marked as replied");
                const updated = res.data.data;
                setSupports(prev => prev.map(s => s.support_id === id ? updated : s));
                if (selected?.support_id === id) setSelected(updated);
            } else toast.error(res.data.message);
        } catch { toast.error("Failed to update"); }
        finally { setActionLoading(null); }
    };

    const deleteRequest = async (id) => {
        if (!confirm("Delete this contact request?")) return;
        setActionLoading(id + "_delete");
        try {
            const res = await axios.delete(`/api/support/${id}`);
            if (res.data.success) {
                toast.success("Deleted successfully");
                setSupports(prev => prev.filter(s => s.support_id !== id));
                if (selected?.support_id === id) { setSelected(null); setReplyText(""); }
            } else toast.error(res.data.message);
        } catch { toast.error("Failed to delete"); }
        finally { setActionLoading(null); }
    };

    const filtered = useMemo(() => {
        let list = supports;
        if (filter !== "all") list = list.filter(s => s.status === filter);
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(s =>
                s.name?.toLowerCase().includes(q) ||
                s.email?.toLowerCase().includes(q) ||
                s.subject?.toLowerCase().includes(q) ||
                s.description?.toLowerCase().includes(q)
            );
        }
        return list;
    }, [supports, filter, search]);

    const stats = {
        total:   supports.length,
        pending: supports.filter(s => s.status === "pending").length,
        replied: supports.filter(s => s.status === "replied").length,
    };

    const fmt = (d) => d ? new Date(d).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit"
    }) : "";

    return (
        <div className="flex h-[calc(100vh-6rem)] overflow-hidden m-4 gap-0 bg-white rounded-xl border border-gray-100 shadow-sm">

            {/* ── Left Panel ── */}
            <div className={`w-full md:w-80 flex-shrink-0 flex-col border-r border-gray-100 bg-gray-50/50 ${selected ? 'hidden md:flex' : 'flex'}`}>

                <div className="p-4 border-b border-gray-100 bg-white space-y-3">
                    <div className="flex items-center gap-2">
                        <FaEnvelopeOpenText className="text-amber-500" size={16} />
                        <h2 className="text-base font-bold text-gray-800">Contact Requests</h2>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                            <p className="text-lg font-bold text-gray-800">{stats.total}</p>
                            <p className="text-[10px] text-gray-400 font-medium">Total</p>
                        </div>
                        <div className="text-center p-2 bg-amber-50 rounded-lg">
                            <p className="text-lg font-bold text-amber-700">{stats.pending}</p>
                            <p className="text-[10px] text-amber-500 font-medium">Pending</p>
                        </div>
                        <div className="text-center p-2 bg-emerald-50 rounded-lg">
                            <p className="text-lg font-bold text-emerald-700">{stats.replied}</p>
                            <p className="text-[10px] text-emerald-500 font-medium">Replied</p>
                        </div>
                    </div>

                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={11} />
                        <input
                            type="text" value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search requests..."
                            className="w-full pl-8 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                        />
                        {search && (
                            <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <FaTimes size={10} />
                            </button>
                        )}
                    </div>

                    <div className="flex gap-1">
                        {["all", "pending", "replied"].map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                className={`flex-1 text-[11px] py-1.5 rounded-lg font-medium capitalize transition-colors ${
                                    filter === f ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                }`}>
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <FaSpinner size={20} className="animate-spin text-amber-400" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center py-12 text-gray-400">
                            <FaInbox size={28} className="mb-2 text-gray-300" />
                            <p className="text-sm">No requests found</p>
                        </div>
                    ) : filtered.map(s => {
                        const isPending = s.status === "pending";
                        const isActive = selected?.support_id === s.support_id;
                        return (
                            <div key={s.support_id}
                                onClick={() => openRequest(s)}
                                className={`p-3.5 cursor-pointer transition-all border-l-4 ${
                                    isActive ? "bg-amber-50 border-l-amber-500" : "border-l-transparent hover:bg-white"
                                }`}>
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <p className={`text-sm font-semibold line-clamp-1 ${isActive ? "text-amber-800" : "text-gray-800"}`}>
                                        {s.subject || "No subject"}
                                    </p>
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0 ${
                                        isPending ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                                    }`}>
                                        {isPending ? "Pending" : "Replied"}
                                    </span>
                                </div>
                                <p className="text-xs font-medium text-gray-600">{s.name}</p>
                                <p className="text-[10px] text-gray-400 truncate">{s.email}</p>
                                <p className="text-[10px] text-gray-400 mt-1">{fmt(s.created_at)}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Right Panel ── */}
            <div className={`flex-1 flex-col overflow-hidden ${!selected ? 'hidden md:flex' : 'flex'}`}>
                {selected ? (
                    <>
                        {/* Header */}
                        <div className="p-5 border-b border-gray-100 bg-white">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2 md:hidden">
                                        <button onClick={() => setSelected(null)} className="p-1 -ml-1 text-gray-400 hover:text-gray-800 rounded">
                                            <FaArrowLeft size={14} />
                                        </button>
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Back to inbox</span>
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900 truncate">{selected.subject || "No subject"}</h2>
                                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                            <FaUserTie size={10} className="text-gray-400" /> {selected.name}
                                        </span>
                                        <a href={`mailto:${selected.email}`}
                                            className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                            <FaRegEnvelope size={10} /> {selected.email}
                                        </a>
                                        <span className="text-xs text-gray-400">#{selected.support_id}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                            selected.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                                        }`}>
                                            {selected.status === "pending" ? "Pending" : "✓ Replied"}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Received: {fmt(selected.created_at)}</p>
                                    {selected.responder_name && (
                                        <p className="text-xs text-emerald-600 mt-0.5">
                                            Responded by: <strong>{selected.responder_name}</strong>
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {selected.status === "pending" && (
                                        <button
                                            onClick={() => markReplied(selected.support_id)}
                                            disabled={actionLoading === selected.support_id + "_reply"}
                                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium disabled:opacity-60">
                                            {actionLoading === selected.support_id + "_reply"
                                                ? <FaSpinner size={11} className="animate-spin" />
                                                : <FaCheckCircle size={11} />}
                                            Mark Replied
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteRequest(selected.support_id)}
                                        disabled={actionLoading === selected.support_id + "_delete"}
                                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 transition font-medium disabled:opacity-60">
                                        {actionLoading === selected.support_id + "_delete"
                                            ? <FaSpinner size={11} className="animate-spin" />
                                            : <FaTrash size={11} />}
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-5 bg-gray-50/30 space-y-4">

                            {/* Original message */}
                            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Message from {selected.name}</h3>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.description}</p>
                            </div>

                            {/* Stored reply (if any) */}
                            {selected.reply && (
                                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 shadow-sm">
                                    <h3 className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-3 flex items-center gap-1">
                                        <FiMessageSquare size={11} /> Your Reply
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.reply}</p>
                                </div>
                            )}

                            {/* Contact info */}
                            <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Sender Details</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium">Name</p>
                                        <p className="text-sm text-gray-800 font-semibold mt-0.5">{selected.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium">Email</p>
                                        <a href={`mailto:${selected.email}`} className="text-sm text-blue-600 hover:underline font-medium mt-0.5 block">{selected.email}</a>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium">Submitted</p>
                                        <p className="text-sm text-gray-700 mt-0.5">{fmt(selected.created_at)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium">Status</p>
                                        <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-semibold mt-0.5 ${
                                            selected.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                                        }`}>
                                            {selected.status === "pending" ? "Awaiting Reply" : "✓ Replied"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reply composer */}
                        <div className="border-t border-gray-100 bg-white p-4">
                            <div className="flex items-start gap-3">
                                <div className="flex-1">
                                    <textarea
                                        rows={3}
                                        value={replyText}
                                        onChange={e => setReplyText(e.target.value)}
                                        placeholder={`Reply to ${selected.email}... (will be sent via email)`}
                                        className="w-full text-sm px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent placeholder-gray-400"
                                    />
                                </div>
                                <button
                                    onClick={sendReply}
                                    disabled={replyLoading || !replyText.trim()}
                                    className="flex items-center gap-2 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0">
                                    {replyLoading ? <FaSpinner size={14} className="animate-spin" /> : <FaPaperPlane size={14} />}
                                    Save Reply
                                </button>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-2">
                                Entering a reply and clicking &quot;Save Reply&quot; will send an email to {selected.email}. Clicking &quot;Mark Replied&quot; will close the request without sending an email.
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
                        <FaEnvelopeOpenText size={44} className="mb-4 text-gray-200" />
                        <p className="text-gray-500 font-semibold text-lg">Select a request</p>
                        <p className="text-sm text-gray-400 mt-1 text-center max-w-xs">
                            Choose a contact request from the list to view and reply
                        </p>
                        {stats.pending > 0 && (
                            <div className="mt-4 px-4 py-2 bg-amber-50 border border-amber-100 rounded-lg">
                                <p className="text-sm text-amber-700 font-medium">
                                    {stats.pending} pending {stats.pending === 1 ? "request" : "requests"} need attention
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
