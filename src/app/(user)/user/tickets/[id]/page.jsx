'use client'
import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { Context } from '@/component/helper/Context'
import { RiSendPlane2Line, RiArrowLeftLine, RiHistoryLine } from 'react-icons/ri'

const TicketChat = () => {
    const { id } = useParams()
    const router = useRouter()
    const { userData } = useContext(Context)
    const [ticket, setTicket] = useState(null)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true)

    const fetchTicket = React.useCallback(async () => {
        try {
            const res = await axios.get(`/api/ticket/${id}`)
            setTicket(res.data.data)
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
            alert('Failed to send message')
        }
    }

    if (loading) return (
        <div className="h-[60vh] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
    )

    if (!ticket) return (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
            <h2 className="text-xl font-bold text-slate-800">Ticket Not Found</h2>
            <button onClick={() => router.back()} className="text-emerald-600 font-bold hover:underline">Go Back</button>
        </div>
    )

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-500">
                    <RiArrowLeftLine size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Support Thread</h1>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Ticket #{ticket.ticket_id}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-start justify-between">
                        <h2 className="text-lg font-bold text-slate-800">{ticket.subject}</h2>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase
                            ${ticket.status === 'open' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                            {ticket.status}
                        </span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white no-scrollbar">
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
                                <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed border transition-all
                                    ${isMe 
                                        ? 'bg-emerald-500 text-white border-emerald-500 rounded-tr-none' 
                                        : 'bg-slate-50 text-slate-700 border-slate-100 rounded-tl-none'}`}>
                                    <p className="whitespace-pre-wrap">{msg.message}</p>
                                </div>
                                <span className="text-[10px] text-slate-400 mt-2 font-medium">
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        )
                    })}
                </div>

                {ticket.status !== 'closed' ? (
                    <div className="p-4 border-t border-slate-100 bg-white">
                        <div className="bg-slate-50 rounded-xl border border-slate-200 p-2 flex items-center gap-3">
                            <textarea 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Write your message..."
                                className="input-standard h-12 resize-none" 
                            />
                            <button 
                                onClick={sendMessage}
                                className="p-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all"
                            >
                                <RiSendPlane2Line size={20} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="p-6 bg-slate-50 text-center">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">This ticket is closed</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TicketChat
