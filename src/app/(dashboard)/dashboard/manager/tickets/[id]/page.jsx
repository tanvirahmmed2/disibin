'use client'
import React, { useState, useEffect, useContext, use } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Context } from '@/component/helper/Context'
import { RiSendPlane2Line, RiArrowLeftLine, RiCheckboxCircleLine, RiInformationLine, RiHistoryLine, RiSettings4Line } from 'react-icons/ri'
import toast from 'react-hot-toast'

const ManagerTicketChat = ({ params }) => {
    const { id } = use(params)
    const router = useRouter()
    const { userData } = useContext(Context)
    const [ticket, setTicket] = useState(null)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)

    const fetchTicket = React.useCallback(async () => {
        try {
            const res = await axios.get(`/api/ticket`)
            const current = res.data.data.find(t => String(t.ticket_id) === String(id))
            if (current) {
                setTicket(current)
            } else {
                toast.error('Ticket not found or not assigned to you')
            }
        } catch (error) {
            console.error('Failed to fetch ticket', error)
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => {
        if (id) {
            fetchTicket()
            const interval = setInterval(fetchTicket, 5000)
            return () => clearInterval(interval)
        }
    }, [id, fetchTicket])

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
            toast.error('Failed to send message')
        }
    }

    const updateTicketStatus = async (status) => {
        setUpdating(true)
        try {
            await axios.patch('/api/ticket', {
                id: ticket.ticket_id,
                status: status
            })
            toast.success(`Ticket ${status}`)
            fetchTicket()
        } catch (error) {
            toast.error('Failed to update status')
        } finally {
            setUpdating(false)
        }
    }

    if (loading) return (
        <div className="h-[60vh] flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
        </div>
    )

    if (!ticket) return (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Ticket Not Found</h2>
            <button onClick={() => router.back()} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-all">Go Back</button>
        </div>
    )

    return (
        <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <button 
                    onClick={() => router.back()}
                    className="p-2 border border-slate-200 text-slate-400 hover:text-slate-900 transition-all"
                >
                    <RiArrowLeftLine size={16} />
                </button>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-white px-2 py-1 border border-slate-200">
                        <select 
                            className="bg-transparent text-[9px] font-bold text-slate-700 outline-none cursor-pointer uppercase tracking-widest"
                            value={ticket.status}
                            onChange={(e) => updateTicketStatus(e.target.value)}
                            disabled={updating}
                        >
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 flex flex-col overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/30">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                Ticket #{ticket.ticket_id}
                            </p>
                            <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight leading-none">{ticket.subject}</h1>
                        </div>
                        <span className={`px-2 py-0.5 border text-[9px] font-bold uppercase tracking-widest
                            ${ticket.status === 'open' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                              ticket.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                              'bg-slate-50 text-slate-700 border-slate-200'}`}>
                            {ticket.status}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <div className="flex items-center gap-2">
                            <span>Date: {new Date(ticket.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>Client: <span className="text-slate-600">{ticket.sender_name}</span></span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 min-h-[400px] max-h-[500px] overflow-y-auto p-6 space-y-4 bg-slate-50/10 no-scrollbar">
                    {ticket.messages?.map((msg, index) => {
                        const isMe = String(msg.senderId) === String(userData?.user_id);
                        
                        return (
                            <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[85%] px-4 py-2 border text-[11px] font-bold uppercase tracking-tight leading-relaxed
                                    ${isMe 
                                        ? 'bg-slate-900 border-slate-900 text-white' 
                                        : 'bg-white border-slate-200 text-slate-700'}`}>
                                    {msg.message}
                                </div>
                                <span className="text-[9px] text-slate-400 mt-1 font-bold uppercase tracking-widest">
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        )
                    })}
                </div>

                {ticket.status !== 'closed' ? (
                    <div className="p-4 border-t border-slate-200 bg-white">
                        <div className="flex items-center gap-2">
                             <input 
                                 type="text"
                                 value={message}
                                 onChange={(e) => setMessage(e.target.value)}
                                 placeholder="Type message..."
                                 className="flex-1 bg-slate-50 border border-slate-200 px-4 py-2 text-xs font-bold focus:outline-none focus:border-slate-400 transition-all" 
                                 onKeyDown={e => e.key === 'Enter' && sendMessage()}
                             />
                            <button 
                                onClick={sendMessage}
                                disabled={!message.trim()}
                                className="p-2 bg-slate-900 text-white hover:bg-slate-800 transition-all disabled:opacity-50"
                            >
                                <RiSendPlane2Line size={18} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                        Ticket is closed
                    </div>
                )}
            </div>
        </div>
    )
}

export default ManagerTicketChat
