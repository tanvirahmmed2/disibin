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

    const fetchTicket = async () => {
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
    }

    useEffect(() => {
        if (id) {
            fetchTicket()
            const interval = setInterval(fetchTicket, 5000)
            return () => clearInterval(interval)
        }
    }, [id])

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
            <div className="w-12 h-12 border-4 border-slate-100 border-t-primary rounded-full animate-spin"></div>
        </div>
    )

    if (!ticket) return (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
            <h2 className="text-xl font-bold text-slate-800">Ticket Not Found</h2>
            <button onClick={() => router.back()} className="text-primary font-bold">Go Back</button>
        </div>
    )

    return (
        <div className="max-w-4xl mx-auto space-y-6 py-6">
            <div className="flex items-center justify-between px-4">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-medium text-sm"
                >
                    <RiArrowLeftLine size={18} /> Back
                </button>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-slate-200 rounded-lg shadow-sm">
                        <RiSettings4Line className="text-slate-400" size={16} />
                        <select 
                            className="bg-transparent text-[10px] font-bold text-slate-700 outline-none cursor-pointer uppercase tracking-widest"
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

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-100 bg-slate-50/30">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                <RiInformationLine /> Ticket #{ticket.ticket_id}
                            </div>
                            <h1 className="text-xl font-bold text-slate-800">{ticket.subject}</h1>
                        </div>
                        <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest
                            ${ticket.status === 'open' ? 'bg-emerald-100 text-emerald-700' : 
                              ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 
                              'bg-slate-100 text-slate-400'}`}>
                            {ticket.status}
                        </span>
                    </div>
                    <div className="flex gap-6 text-xs">
                        <div className="flex items-center gap-2">
                            <RiHistoryLine className="text-slate-400" size={14} />
                            <span className="text-slate-500">Opened: {new Date(ticket.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-[10px] font-bold">
                                {ticket.sender_name?.charAt(0)}
                            </div>
                            <span className="text-slate-500">Client: {ticket.sender_name}</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 min-h-[400px] max-h-[500px] overflow-y-auto p-6 space-y-4 no-scrollbar">
                    {ticket.messages?.map((msg, index) => {
                        const isMe = String(msg.senderId) === String(userData?.user_id);
                        
                        return (
                            <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed
                                    ${isMe 
                                        ? 'bg-primary text-white rounded-tr-none shadow-sm shadow-primary/10' 
                                        : 'bg-slate-100 text-slate-700 rounded-tl-none'}`}>
                                    {msg.message}
                                </div>
                                <span className="text-[9px] text-slate-400 mt-1 font-bold uppercase tracking-tight">
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        )
                    })}
                </div>

                {ticket.status !== 'closed' ? (
                    <div className="p-4 border-t border-slate-100 bg-white">
                        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                             <textarea 
                                 value={message}
                                 onChange={(e) => setMessage(e.target.value)}
                                 placeholder="Type a message..."
                                 className="w-full bg-transparent p-2 text-sm outline-none resize-none h-10" 
                             />
                            <button 
                                onClick={sendMessage}
                                disabled={!message.trim()}
                                className="p-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all disabled:opacity-50 shadow-md shadow-primary/20"
                            >
                                <RiSendPlane2Line size={18} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-center text-slate-400 font-bold text-xs">
                        Ticket is closed
                    </div>
                )}
            </div>
        </div>
    )
}

export default ManagerTicketChat
