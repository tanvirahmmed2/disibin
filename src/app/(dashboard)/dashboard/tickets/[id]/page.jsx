'use client'
import React, { useState, useEffect, useContext, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { Context } from '@/component/helper/Context'
import { 
    RiArrowLeftLine, 
    RiSendPlane2Line, 
    RiInformationLine, 
    RiCheckLine,
    RiTimeLine,
    RiUserLine
} from 'react-icons/ri'

const TicketChatPage = () => {
    const { id } = useParams()
    const router = useRouter()
    const { userData } = useContext(Context)
    const [ticket, setTicket] = useState(null)
    const [messages, setMessages] = useState([])
    const [inputText, setInputText] = useState('')
    const [loading, setLoading] = useState(true)
    const scrollRef = useRef()

    const fetchTicket = async () => {
        try {
            // Reusing the general GET route but filtering for this ID (or I could add a specific route)
            const res = await axios.get(`/api/ticket`)
            const found = res.data.payload.find(t => t._id === id)
            if (found) {
                setTicket(found)
                setMessages(found.messages || [])
            }
        } catch (error) {
            console.error('Failed to fetch ticket', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) fetchTicket()
    }, [id])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = async (e) => {
        e.preventDefault()
        if (!inputText.trim()) return

        try {
            await axios.patch('/api/ticket', {
                id,
                message: inputText
            })
            // Optimistic update
            setMessages([...messages, {
                senderId: userData._id,
                message: inputText,
                createdAt: new Date()
            }])
            setInputText('')
        } catch (error) {
            alert('Failed to send message')
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-600"></div>
        </div>
    )

    if (!ticket) return <div className="p-8 text-center text-slate-500">Ticket not found</div>

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] bg-slate-50/30 rounded-[2.5rem] overflow-hidden border border-slate-50">
            {/* Header */}
            <div className="bg-white p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => router.back()}
                        className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-all"
                    >
                        <RiArrowLeftLine size={24} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight">{ticket.subject}</h1>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{ticket.category}</span>
                            <span className="text-slate-300">•</span>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${ticket.status === 'open' ? 'text-amber-500' : 'text-slate-400'}`}>
                                {ticket.status}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Priority</span>
                        <span className={`text-xs font-bold ${ticket.priority === 'urgent' ? 'text-red-500' : 'text-slate-600'}`}>
                            {ticket.priority.toUpperCase()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                {messages.map((msg, index) => {
                    const isMe = msg.senderId === userData?._id
                    return (
                        <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-3xl shadow-sm border
                                ${isMe ? 'bg-emerald-600 text-white border-emerald-500 rounded-tr-none' : 'bg-white text-slate-700 border-slate-100 rounded-tl-none'}`}>
                                <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                            </div>
                            <div className="flex items-center gap-1 mt-1.5 px-1">
                                <span className="text-[10px] text-slate-400 font-bold">
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    )
                })}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-slate-100">
                <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-3">
                    <div className="flex-1 relative">
                        <input 
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            className="w-full pl-4 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-700"
                            placeholder="Type your response..."
                        />
                    </div>
                    <button 
                        type="submit"
                        disabled={!inputText.trim()}
                        className="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-100 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center"
                    >
                        <RiSendPlane2Line size={24} />
                    </button>
                </form>
            </div>
        </div>
    )
}

export default TicketChatPage
