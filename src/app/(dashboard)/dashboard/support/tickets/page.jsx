"use client";

import { useState, useEffect, useRef } from "react";
import { FaTimes, FaPaperPlane, FaTicketAlt, FaUserTag, FaCheck } from "react-icons/fa";
import toast from "react-hot-toast";

const STATUS_OPTIONS = ["open", "in_progress", "resolved", "closed"];
const STATUS_STYLES = {
    open: { label: "Open", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    in_progress: { label: "In Progress", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    resolved: { label: "Resolved", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
    closed: { label: "Closed", bg: "bg-gray-100", text: "text-gray-500", border: "border-gray-200" },
};
const PRIORITY_STYLES = {
    low: "text-gray-400", medium: "text-blue-500", high: "text-orange-500", urgent: "text-red-600",
};

export default function SupportTicketsPage() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTicket, setActiveTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loadingThread, setLoadingThread] = useState(false);
    const [reply, setReply] = useState("");
    const [currentUserId, setCurrentUserId] = useState(null);
    const [managers, setManagers] = useState([]);
    const [filter, setFilter] = useState("all");
    const messagesEndRef = useRef(null);

    useEffect(() => { fetchMe(); fetchTickets(); fetchManagers(); }, []);
    useEffect(() => { if (activeTicket) fetchThread(activeTicket.ticket_id); }, [activeTicket]);
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    const fetchMe = async () => {
        try {
            const res = await fetch("/api/user/me");
            const data = await res.json();
            if (data.success) setCurrentUserId(data.data.id);
        } catch {}
    };

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/ticket");
            const data = await res.json();
            if (data.success) setTickets(data.data);
        } catch { toast.error("Failed to load tickets"); }
        finally { setLoading(false); }
    };

    const fetchThread = async (ticketId) => {
        setLoadingThread(true);
        try {
            const res = await fetch(`/api/ticket/${ticketId}`);
            const data = await res.json();
            if (data.success) {
                setMessages(data.data.messages || []);
                // sync ticket data in case it changed
                setActiveTicket(prev => ({ ...prev, ...data.data }));
            }
        } catch { toast.error("Failed to load thread"); }
        finally { setLoadingThread(false); }
    };

    const fetchManagers = async () => {
        try {
            const res = await fetch("/api/user/management");
            const data = await res.json();
            if (data.success) setManagers(data.data.filter(u => u.role === "manager" || u.role === "admin"));
        } catch {}
    };

    const sendReply = async (e) => {
        e.preventDefault();
        if (!reply.trim() || !activeTicket) return;
        try {
            const res = await fetch(`/api/ticket/${activeTicket.ticket_id}/message`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: reply }),
            });
            const data = await res.json();
            if (data.success) {
                setMessages(prev => [...prev, data.data]);
                setReply("");
            } else toast.error(data.message);
        } catch { toast.error("Failed to send reply"); }
    };

    const updateStatus = async (status) => {
        try {
            const res = await fetch(`/api/ticket/${activeTicket.ticket_id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Status updated");
                setActiveTicket(prev => ({ ...prev, status }));
                setTickets(prev => prev.map(t => t.ticket_id === activeTicket.ticket_id ? { ...t, status } : t));
            } else toast.error(data.message);
        } catch { toast.error("Failed to update status"); }
    };

    const assignToManager = async (managerId) => {
        try {
            const res = await fetch(`/api/ticket/${activeTicket.ticket_id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ assigned_to: managerId }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Ticket escalated to manager");
                const mgr = managers.find(m => m.user_id === managerId);
                setActiveTicket(prev => ({ ...prev, assigned_to: managerId, assigned_name: mgr?.name || "Manager", status: "in_progress" }));
                setTickets(prev => prev.map(t => t.ticket_id === activeTicket.ticket_id ? { ...t, assigned_to: managerId, status: "in_progress" } : t));
            } else toast.error(data.message);
        } catch { toast.error("Failed to assign ticket"); }
    };

    const filteredTickets = tickets.filter(t => {
        if (filter === "all") return true;
        return t.status === filter;
    });

    const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";
    const formatTime = (d) => d ? new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

    return (
        <div className="flex h-[calc(100vh-6rem)] gap-0 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden m-4">

            {/* Left Sidebar - Ticket List */}
            <div className="w-80 flex-shrink-0 flex flex-col border-r border-gray-100 bg-gray-50/50">
                <div className="p-4 border-b border-gray-100 bg-white">
                    <h2 className="text-lg font-bold text-gray-800 mb-3">Support Tickets</h2>
                    {/* Filter tabs */}
                    <div className="flex gap-1 flex-wrap">
                        {["all", "open", "in_progress", "resolved"].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`text-[11px] px-2.5 py-1 rounded-full font-medium capitalize transition-colors ${filter === f ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                            >
                                {f === "all" ? "All" : STATUS_STYLES[f]?.label || f}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                    {loading ? (
                        <div className="flex justify-center py-10"><div className="animate-spin w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full" /></div>
                    ) : filteredTickets.length === 0 ? (
                        <div className="flex flex-col items-center py-12 text-gray-400">
                            <FaTicketAlt size={24} className="mb-2 text-gray-300" />
                            <p className="text-sm">No tickets found</p>
                        </div>
                    ) : (
                        filteredTickets.map(t => {
                            const s = STATUS_STYLES[t.status] || STATUS_STYLES.open;
                            const isActive = activeTicket?.ticket_id === t.ticket_id;
                            return (
                                <div
                                    key={t.ticket_id}
                                    onClick={() => setActiveTicket(t)}
                                    className={`p-3 cursor-pointer transition-all border-l-4 ${isActive ? "bg-blue-50 border-l-blue-600" : "border-l-transparent hover:bg-white"}`}
                                >
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <h3 className={`font-semibold text-sm line-clamp-1 ${isActive ? "text-blue-700" : "text-gray-800"}`}>{t.subject}</h3>
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-medium flex-shrink-0 ${s.bg} ${s.text} ${s.border}`}>{s.label}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 truncate mb-1">{t.user_name || "User"}</p>
                                    <div className="flex items-center justify-between text-[10px] text-gray-400">
                                        <span className={`capitalize font-medium ${PRIORITY_STYLES[t.priority]}`}>{t.priority}</span>
                                        <span>{formatDate(t.created_at)}</span>
                                    </div>
                                    {t.assigned_name && (
                                        <p className="text-[10px] text-emerald-600 mt-0.5 flex items-center gap-1">
                                            <FaUserTag size={9} /> {t.assigned_name}
                                        </p>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Main Panel */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {activeTicket ? (
                    <>
                        {/* Ticket Header */}
                        <div className="p-4 border-b border-gray-100 bg-white">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <h2 className="font-bold text-gray-800 truncate">{activeTicket.subject}</h2>
                                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                                        <span className="text-xs text-gray-400">#{activeTicket.ticket_id}</span>
                                        <span className="text-xs text-gray-500">From: <strong>{activeTicket.user_name}</strong></span>
                                        <span className={`text-xs font-medium capitalize ${PRIORITY_STYLES[activeTicket.priority]}`}>{activeTicket.priority}</span>
                                        {activeTicket.assigned_name && (
                                            <span className="text-xs text-emerald-600 flex items-center gap-1">
                                                <FaUserTag size={10} /> {activeTicket.assigned_name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {/* Status buttons */}
                                <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap justify-end">
                                    {STATUS_OPTIONS.map(s => {
                                        const style = STATUS_STYLES[s];
                                        const isActive = activeTicket.status === s;
                                        return (
                                            <button
                                                key={s}
                                                onClick={() => !isActive && updateStatus(s)}
                                                disabled={isActive}
                                                className={`text-[11px] px-2.5 py-1 rounded-full border font-medium transition-all flex items-center gap-1 ${isActive ? `${style.bg} ${style.text} ${style.border} ring-2 ring-offset-1 ring-blue-400 cursor-default` : `bg-white text-gray-400 border-gray-200 hover:${style.bg} hover:${style.text}`}`}
                                            >
                                                {isActive && <FaCheck size={8} />}{style.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Assign to Manager */}
                            {managers.length > 0 && (
                                <div className="mt-3 flex items-center gap-2">
                                    <span className="text-xs text-gray-500 font-medium">Escalate to:</span>
                                    <div className="flex gap-1.5 flex-wrap">
                                        {managers.map(m => (
                                            <button
                                                key={m.user_id}
                                                onClick={() => assignToManager(m.user_id)}
                                                disabled={activeTicket.assigned_to === m.user_id}
                                                className={`text-[11px] px-2.5 py-1 rounded-full font-medium border transition-colors flex items-center gap-1 ${activeTicket.assigned_to === m.user_id ? "bg-emerald-50 text-emerald-700 border-emerald-200 cursor-default" : "bg-white text-gray-600 border-gray-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200"}`}
                                            >
                                                {activeTicket.assigned_to === m.user_id && <FaCheck size={8} />}
                                                <FaUserTag size={9} /> {m.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
                            {/* Original message */}
                            <div className="flex flex-col items-start">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <span className="text-xs font-medium text-gray-600">{activeTicket.user_name}</span>
                                    <span className="text-[10px] text-gray-400">(user)</span>
                                </div>
                                <div className="bg-white border border-gray-100 shadow-sm rounded-xl rounded-bl-none px-3 py-2 text-sm text-gray-800 max-w-[85%]">
                                    {activeTicket.message}
                                </div>
                                <span className="text-[10px] text-gray-400 mt-1">{formatDate(activeTicket.created_at)}</span>
                            </div>

                            {loadingThread ? (
                                <div className="text-center text-sm text-gray-400 py-4">Loading...</div>
                            ) : (
                                messages.map((msg, i) => {
                                    const isMe = msg.user_id === currentUserId;
                                    return (
                                        <div key={msg.message_id || i} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <span className="text-xs font-medium text-gray-600">{msg.user_name}</span>
                                                <span className="text-[10px] text-gray-400 capitalize">({msg.user_role})</span>
                                            </div>
                                            <div className={`px-3 py-2 rounded-xl text-sm max-w-[85%] ${isMe ? "bg-blue-600 text-white rounded-br-none" : "bg-white border border-gray-100 shadow-sm text-gray-800 rounded-bl-none"}`}>
                                                {msg.message}
                                            </div>
                                            <span className="text-[10px] text-gray-400 mt-1">{formatTime(msg.created_at)}</span>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Reply Input */}
                        <div className="p-4 border-t border-gray-100 bg-white">
                            <form onSubmit={sendReply} className="flex gap-2">
                                <input
                                    type="text"
                                    value={reply}
                                    onChange={e => setReply(e.target.value)}
                                    placeholder="Reply to this ticket..."
                                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button
                                    type="submit"
                                    disabled={!reply.trim()}
                                    className="p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed"
                                >
                                    <FaPaperPlane size={14} />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <FaTicketAlt size={40} className="mb-3 text-gray-300" />
                        <p className="font-medium text-gray-500">Select a ticket</p>
                        <p className="text-sm">to manage the conversation</p>
                    </div>
                )}
            </div>
        </div>
    );
}
