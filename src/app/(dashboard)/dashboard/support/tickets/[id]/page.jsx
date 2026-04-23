'use client'
import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { Context } from '@/component/helper/Context'
import { RiSendPlane2Line, RiArrowLeftLine, RiCheckboxCircleLine, RiInformationLine, RiHistoryLine, RiSettings4Line, RiUserShared2Line } from 'react-icons/ri'

const SupportTicketChat = () => {
    const { id } = useParams()
    const router = useRouter()
    const { userData } = useContext(Context)
    const [ticket, setTicket] = useState(null)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [managers, setManagers] = useState([])
    const [updating, setUpdating] = useState(false)

    const isStaff = ['admin', 'manager', 'support'].includes(userData?.role);

    const fetchTicket = async () => {
        try {
            const res = await axios.get(`/api/ticket`)
            const current = res.data.data.find(t => String(t.ticket_id) === String(id))
            setTicket(current)
        } catch (error) {
            console.error('Failed to fetch ticket', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchManagers = async () => {
        try {
            const res = await axios.get(`/api/user?role=manager`);
            setManagers(res.data.data || []);
        } catch (error) {
            console.error('Failed to fetch managers', error);
        }
    }

    useEffect(() => {
        if (id) {
            fetchTicket()
            if (isStaff) {
                fetchManagers()
            }
            const interval = setInterval(fetchTicket, 5000)
            return () => clearInterval(interval)
        }
    }, [id, isStaff])

    const sendMessage = async () => {
        if (!message.trim()) return
        try {
            await axios.patch('/api/ticket', {
                id: ticket.ticket_id,
                message: message
            })
            setMessage('')
            fetchTicket()
        } catch (error) {
            alert('Failed to send message')
        }
    }

    const closeTicket = async () => {
        try {
            await axios.patch('/api/ticket', {
                id: ticket.ticket_id,
                status: 'closed'
            })
            fetchTicket()
        } catch (error) {
            alert('Failed to close ticket')
        }
    }

    const updateTicketDetails = async (field, value) => {
        setUpdating(true)
        try {
            await axios.patch('/api/ticket', {
                id: ticket.ticket_id,
                [field]: value
            })
            fetchTicket()
        } catch (error) {
            alert('Failed to update ticket')
        } finally {
            setUpdating(false)
        }
    }

    if (loading) return (
        <div className="h-[60vh] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
    )

    if (!ticket) return (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
            <h2 className="text-2xl font-black text-slate-800">Ticket Not Found</h2>
            <button onClick={() => router.back()} className="btn-primary">Go Back</button>
        </div>
    )

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <button onClick={() => router.back()} className="p-3 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all text-slate-500 shadow-sm">
                    <RiArrowLeftLine size={20} />
                </button>
                <div className="flex items-center gap-2 flex-wrap">
                    {isStaff && (
                        <>
                            <div className="flex items-center gap-2 bg-white px-4 py-2 border border-slate-100 rounded-xl shadow-sm">
                                <RiSettings4Line className="text-slate-400" />
                                <select 
                                    className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer uppercase tracking-widest"
                                    value={ticket.status}
                                    onChange={(e) => updateTicketDetails('status', e.target.value)}
                                    disabled={updating}
                                >
                                    <option value="open">Open</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2 bg-white px-4 py-2 border border-slate-100 rounded-xl shadow-sm">
                                <RiUserShared2Line className="text-slate-400" />
                                <select 
                                    className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer uppercase tracking-widest max-w-[150px] truncate"
                                    value={ticket.assigned_to || ''}
                                    onChange={(e) => updateTicketDetails('assignedId', e.target.value)}
                                    disabled={updating}
                                >
                                    <option value="">Unassigned</option>
                                    {managers.map(m => (
                                        <option key={m.user_id} value={m.user_id}>Escalate to {m.name}</option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}
                    {ticket.status !== 'closed' && !isStaff && (
                        <button onClick={closeTicket} className="btn-primary flex items-center gap-2 !bg-slate-800">
                            <RiCheckboxCircleLine /> Close Ticket
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden flex flex-col">
                <div className="p-8 border-b border-slate-50 bg-slate-50/30">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">
                                <RiInformationLine /> Ticket #{ticket.ticket_id}
                            </div>
                            <h1 className="text-3xl font-black text-slate-800 tracking-tight">{ticket.subject}</h1>
                        </div>
                        <span className={`px-4 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm
                            ${ticket.status === 'open' ? 'bg-emerald-500 text-white' : 
                              ticket.status === 'in_progress' ? 'bg-blue-500 text-white' : 
                              'bg-slate-100 text-slate-400'}`}>
                            {ticket.status}
                        </span>
                    </div>
                    <div className="flex gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 border border-slate-100">
                                <RiHistoryLine size={14} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Opened On</p>
                                <p className="text-xs font-bold text-slate-600">{new Date(ticket.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                        {ticket.assigned_name && (
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center border border-emerald-100">
                                    {ticket.assigned_name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Assigned To</p>
                                    <p className="text-xs font-bold text-slate-600">{ticket.assigned_name}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 min-h-[400px] max-h-[600px] overflow-y-auto p-8 space-y-6 bg-slate-50/10 no-scrollbar">
                    {ticket.messages?.map((msg, index) => {
                        const isMe = String(msg.senderId) === String(userData?.user_id);
                        const isStaffMsg = ['admin', 'manager', 'support'].includes(msg.senderRole);
                        
                        return (
                            <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                {!isMe && isStaffMsg && (
                                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mb-1 ml-1">
                                        {msg.senderRole.replace('_', ' ')}: {msg.senderName}
                                    </span>
                                )}
                                {!isMe && !isStaffMsg && (
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 ml-1">
                                        Client
                                    </span>
                                )}
                                <div className={`max-w-[80%] p-5 rounded-3xl shadow-sm border transition-all
                                    ${isMe 
                                        ? 'bg-emerald-500 text-white border-emerald-500 rounded-tr-none' 
                                        : 'bg-white text-slate-700 border-slate-100 rounded-tl-none'}`}>
                                    <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                                </div>
                                <span className="text-[9px] text-slate-400 mt-2 font-black uppercase tracking-widest opacity-60">
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        )
                    })}
                </div>

                {ticket.status !== 'closed' ? (
                    <div className="p-6 border-t border-slate-50 bg-white">
                        <div className="bg-slate-50 rounded-3xl border border-slate-100 shadow-inner p-3 flex items-center gap-3 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/5 transition-all duration-500">
                             <textarea 
                                 value={message}
                                 onChange={(e) => setMessage(e.target.value)}
                                 placeholder="Type your response..."
                                 className="input-standard h-12 resize-none" 
                             />
                            <button 
                                onClick={sendMessage}
                                className="p-4 bg-emerald-500 text-white rounded-2xl shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all group"
                            >
                                <RiSendPlane2Line size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="p-6 border-t border-slate-50 bg-slate-50 flex items-center justify-center text-slate-400 font-bold text-sm">
                        This ticket is closed. No further messages can be sent.
                    </div>
                )}
            </div>
        </div>
    )
}

export default SupportTicketChat
