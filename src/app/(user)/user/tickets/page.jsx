"use client";

import { useState, useEffect, useRef } from "react";
import { FaPlus, FaTimes, FaPaperPlane, FaTicketAlt, FaExclamationCircle, FaCheckCircle, FaClock, FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";

const STATUS_STYLES = {
    open: { label: "Open", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: <FaClock size={11} /> },
    in_progress: { label: "In Progress", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: <FaSpinner size={11} /> },
    resolved: { label: "Resolved", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: <FaCheckCircle size={11} /> },
    closed: { label: "Closed", bg: "bg-gray-100", text: "text-gray-500", border: "border-gray-200", icon: <FaCheckCircle size={11} /> },
};
const PRIORITY_STYLES = {
    low: "text-gray-400",
    medium: "text-blue-500",
    high: "text-orange-500",
    urgent: "text-red-600",
};

export default function UserTicketsPage() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTicket, setActiveTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loadingThread, setLoadingThread] = useState(false);
    const [reply, setReply] = useState("");
    const [currentUserId, setCurrentUserId] = useState(null);
    const messagesEndRef = useRef(null);

    // New ticket modal
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ subject: "", message: "", priority: "medium" });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchMe();
        fetchTickets();
    }, []);

    useEffect(() => {
        if (activeTicket) fetchThread(activeTicket.ticket_id);
    }, [activeTicket]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

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
            else toast.error(data.message);
        } catch {
            toast.error("Failed to load tickets");
        } finally {
            setLoading(false);
        }
    };

    const fetchThread = async (ticketId) => {
        setLoadingThread(true);
        try {
            const res = await fetch(`/api/ticket/${ticketId}`);
            const data = await res.json();
            if (data.success) setMessages(data.data.messages || []);
            else toast.error(data.message);
        } catch {
            toast.error("Failed to load conversation");
        } finally {
            setLoadingThread(false);
        }
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
                setMessages((prev) => [...prev, { ...data.data, user_name: "You", user_role: "user" }]);
                setReply("");
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error("Failed to send reply");
        }
    };

    const submitTicket = async (e) => {
        e.preventDefault();
        if (!form.subject || !form.message) return;
        setSubmitting(true);
        try {
            const res = await fetch("/api/ticket", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Ticket submitted!");
                setShowModal(false);
                setForm({ subject: "", message: "", priority: "medium" });
                fetchTickets();
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error("Failed to submit ticket");
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (d) =>
        d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">My Tickets</h1>
                        <p className="text-sm text-gray-500 mt-0.5">Track your support requests</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium text-sm"
                    >
                        <FaPlus size={12} /> New Ticket
                    </button>
                </div>

                <div className="flex gap-4 h-[calc(100vh-12rem)]">
                    {/* Ticket List */}
                    <div className="w-full max-w-sm flex-shrink-0 flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-3 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            {tickets.length} Ticket{tickets.length !== 1 ? "s" : ""}
                        </div>
                        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                            {loading ? (
                                <div className="flex justify-center items-center py-12 text-gray-400">
                                    <div className="animate-spin w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full" />
                                </div>
                            ) : tickets.length === 0 ? (
                                <div className="flex flex-col items-center py-12 text-gray-400">
                                    <FaTicketAlt size={28} className="mb-2 text-gray-300" />
                                    <p className="text-sm">No tickets yet</p>
                                </div>
                            ) : (
                                tickets.map((t) => {
                                    const s = STATUS_STYLES[t.status] || STATUS_STYLES.open;
                                    const isActive = activeTicket?.ticket_id === t.ticket_id;
                                    return (
                                        <div
                                            key={t.ticket_id}
                                            onClick={() => setActiveTicket(t)}
                                            className={`p-4 cursor-pointer transition-all border-l-4 ${isActive ? "bg-blue-50 border-l-blue-600" : "border-l-transparent hover:bg-gray-50"}`}
                                        >
                                            <div className="flex items-start justify-between gap-2 mb-1.5">
                                                <h3 className={`font-semibold text-sm leading-snug line-clamp-1 ${isActive ? "text-blue-700" : "text-gray-800"}`}>
                                                    {t.subject}
                                                </h3>
                                                <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium flex-shrink-0 ${s.bg} ${s.text} ${s.border}`}>
                                                    {s.icon} {s.label}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-gray-400">
                                                <span className={`font-medium capitalize ${PRIORITY_STYLES[t.priority]}`}>{t.priority}</span>
                                                <span>{formatDate(t.created_at)}</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Thread Viewer */}
                    <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        {activeTicket ? (
                            <>
                                {/* Thread Header */}
                                <div className="p-4 border-b border-gray-100">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h2 className="font-bold text-gray-800">{activeTicket.subject}</h2>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                                <span>#{activeTicket.ticket_id}</span>
                                                <span className={`capitalize font-medium ${PRIORITY_STYLES[activeTicket.priority]}`}>
                                                    {activeTicket.priority} priority
                                                </span>
                                                {(() => {
                                                    const s = STATUS_STYLES[activeTicket.status] || STATUS_STYLES.open;
                                                    return (
                                                        <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full border font-medium ${s.bg} ${s.text} ${s.border}`}>
                                                            {s.icon} {s.label}
                                                        </span>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400">{formatDate(activeTicket.created_at)}</span>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/40">
                                    {/* Original message */}
                                    <div className="flex flex-col items-start">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <span className="text-xs font-medium text-gray-600">You</span>
                                            <span className="text-[10px] text-gray-400">(user)</span>
                                        </div>
                                        <div className="bg-white border border-gray-100 shadow-sm rounded-xl rounded-bl-none px-3 py-2 text-sm text-gray-800 max-w-[85%]">
                                            {activeTicket.message}
                                        </div>
                                        <span className="text-[10px] text-gray-400 mt-1">{formatDate(activeTicket.created_at)}</span>
                                    </div>

                                    {loadingThread ? (
                                        <div className="flex justify-center py-4 text-gray-400 text-sm">Loading...</div>
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
                                                    <span className="text-[10px] text-gray-400 mt-1">
                                                        {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                                                    </span>
                                                </div>
                                            );
                                        })
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Reply */}
                                {activeTicket.status !== "closed" && activeTicket.status !== "resolved" && (
                                    <div className="p-4 border-t border-gray-100 bg-white">
                                        <form onSubmit={sendReply} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={reply}
                                                onChange={(e) => setReply(e.target.value)}
                                                placeholder="Add a reply..."
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
                                )}
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                                <FaTicketAlt size={36} className="mb-3 text-gray-300" />
                                <p className="font-medium text-gray-500">Select a ticket</p>
                                <p className="text-sm">to view the conversation</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* New Ticket Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800">Submit a New Ticket</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <FaTimes size={20} />
                            </button>
                        </div>
                        <form onSubmit={submitTicket} className="p-4 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Subject *</label>
                                <input
                                    type="text"
                                    value={form.subject}
                                    onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                                    placeholder="Briefly describe your issue"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Message *</label>
                                <textarea
                                    value={form.message}
                                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                                    placeholder="Describe your issue in detail..."
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Priority</label>
                                <select
                                    value={form.priority}
                                    onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 pt-1">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 shadow-sm"
                                >
                                    {submitting ? "Submitting..." : "Submit Ticket"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
