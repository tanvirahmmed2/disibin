"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiSend, FiUsers, FiShield, FiMail, FiBell } from "react-icons/fi";

export default function BroadcastPage() {
    const [loading, setLoading] = useState(false);
    const [audience, setAudience] = useState("users");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [sendEmailCopy, setSendEmailCopy] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!subject.trim() || !message.trim()) {
            toast.error("Subject and message are required.");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post("/api/broadcast", {
                subject,
                message,
                audience,
                sendEmailCopy
            });

            if (res.data.success) {
                toast.success(`Broadcast sent to ${res.data.data.notifiedCount} people!`);
                setSubject("");
                setMessage("");
                setSendEmailCopy(false);
            } else {
                toast.error(res.data.message || "Failed to send broadcast");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                    <span className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
                        <FiSend className="text-blue-600" size={18} />
                    </span>
                    Broadcast Message
                </h1>
                <p className="text-slate-500 text-sm mt-1">Send a mass message or notification to a specific group of users.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
                
                {/* Audience Selection */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Target Audience</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setAudience("users")}
                            className={`flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                                audience === "users" ? "border-blue-500 bg-blue-50/50" : "border-slate-100 hover:border-slate-200"
                            }`}
                        >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                                audience === "users" ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-500"
                            }`}>
                                <FiUsers size={18} />
                            </div>
                            <div>
                                <h3 className={`font-bold ${audience === "users" ? "text-blue-900" : "text-slate-700"}`}>All Users</h3>
                                <p className="text-xs text-slate-500 mt-1">Standard users, clients, and registered accounts without management privileges.</p>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setAudience("staff")}
                            className={`flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                                audience === "staff" ? "border-violet-500 bg-violet-50/50" : "border-slate-100 hover:border-slate-200"
                            }`}
                        >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                                audience === "staff" ? "bg-violet-500 text-white" : "bg-slate-100 text-slate-500"
                            }`}>
                                <FiShield size={18} />
                            </div>
                            <div>
                                <h3 className={`font-bold ${audience === "staff" ? "text-violet-900" : "text-slate-700"}`}>Internal Staff</h3>
                                <p className="text-xs text-slate-500 mt-1">Administrators, Managers, Developers, and Support Agents.</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Message Content */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Subject</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="e.g. Important System Update"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Message Content</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write your message here..."
                            rows={6}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm resize-y"
                            required
                        />
                    </div>
                </div>

                {/* Delivery Options */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Delivery Options</label>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                            <FiBell className="text-emerald-500" size={18} />
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-slate-800">In-App Notification</p>
                                <p className="text-xs text-slate-500">Users will see this alert in their dashboard notification center. (Always Enabled)</p>
                            </div>
                            <div className="w-10 h-5 bg-emerald-500 rounded-full flex items-center p-0.5 justify-end cursor-not-allowed opacity-80">
                                <div className="w-4 h-4 bg-white rounded-full"></div>
                            </div>
                        </div>

                        <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50/50 cursor-pointer transition-colors">
                            <FiMail className={sendEmailCopy ? "text-blue-500" : "text-slate-400"} size={18} />
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-slate-800">Send Email Copy</p>
                                <p className="text-xs text-slate-500">Also send this message directly to their email inbox.</p>
                            </div>
                            <div className={`w-10 h-5 rounded-full flex items-center p-0.5 transition-colors ${sendEmailCopy ? 'bg-blue-500 justify-end' : 'bg-slate-200 justify-start'}`}>
                                <input 
                                    type="checkbox" 
                                    className="hidden" 
                                    checked={sendEmailCopy}
                                    onChange={(e) => setSendEmailCopy(e.target.checked)}
                                />
                                <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Submit */}
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <FiSend />
                                Send Broadcast
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
