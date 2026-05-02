'use client'
import React, { useState, useEffect, useContext, useRef, useCallback } from 'react'
import axios from 'axios'
import { Context } from '@/component/helper/Context'
import {
    RiSendPlaneFill,
    RiAddLine,
    RiCloseLine,
    RiInboxLine,
    RiSearchLine,
    RiUserLine,
    RiChat3Line,
    RiCheckDoubleLine,
} from 'react-icons/ri'
import toast from 'react-hot-toast'

const ROLE_COLORS = {
    admin:     'text-red-600 bg-red-50 border-red-200',
    manager:   'text-blue-600 bg-blue-50 border-blue-200',
    developer: 'text-purple-600 bg-purple-50 border-purple-200',
    support:   'text-amber-600 bg-amber-50 border-amber-200',
}

const InternalMail = () => {
    const { userData } = useContext(Context)

    const [conversations, setConversations]   = useState([])
    const [messages, setMessages]             = useState([])
    const [activeConvId, setActiveConvId]     = useState(null)
    const [loading, setLoading]               = useState(true)
    const [msgLoading, setMsgLoading]         = useState(false)
    const [inputText, setInputText]           = useState('')
    const [sending, setSending]               = useState(false)

    // New conversation panel
    const [showDirectory, setShowDirectory]   = useState(false)
    const [staffList, setStaffList]           = useState([])
    const [staffLoading, setStaffLoading]     = useState(false)
    const [searchQuery, setSearchQuery]       = useState('')

    // Sidebar search
    const [convSearch, setConvSearch]         = useState('')

    const messagesEndRef = useRef(null)
    const inputRef       = useRef(null)

    // ── Fetch conversation list ───────────────────────────────────────────
    const fetchConversations = useCallback(async () => {
        try {
            const res = await axios.get('/api/messages')
            if (res.data.success) {
                setConversations(res.data.data)
                if (!activeConvId && res.data.data.length > 0) {
                    setActiveConvId(res.data.data[0].conversation_id)
                }
            }
        } catch {
            toast.error('Failed to load conversations')
        } finally {
            setLoading(false)
        }
    }, [activeConvId])

    // ── Fetch messages for active conversation ────────────────────────────
    const fetchMessages = useCallback(async (convId) => {
        if (!convId) return
        setMsgLoading(true)
        try {
            const res = await axios.get(`/api/messages?conversationId=${convId}`)
            if (res.data.success) {
                setMessages(res.data.data)
                setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 80)
            }
        } catch {
            // silent
        } finally {
            setMsgLoading(false)
        }
    }, [])

    // ── Fetch staff directory ─────────────────────────────────────────────
    const fetchStaff = useCallback(async () => {
        setStaffLoading(true)
        try {
            const res = await axios.get('/api/messages/conversations')
            if (res.data.success) setStaffList(res.data.data)
        } catch {
            toast.error('Failed to load directory')
        } finally {
            setStaffLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchConversations()
    }, [])

    useEffect(() => {
        if (showDirectory) fetchStaff()
    }, [showDirectory])

    // Poll active conversation every 5s
    useEffect(() => {
        if (!activeConvId) return
        fetchMessages(activeConvId)
        const interval = setInterval(() => fetchMessages(activeConvId), 5000)
        return () => clearInterval(interval)
    }, [activeConvId])

    // ── Send message ──────────────────────────────────────────────────────
    const handleSend = async (e) => {
        e?.preventDefault()
        if (!inputText.trim() || !activeConvId || sending) return
        setSending(true)
        const optimistic = {
            message_id: `opt-${Date.now()}`,
            sender_id: userData?.user_id,
            sender_name: userData?.name || 'You',
            content: inputText,
            created_at: new Date().toISOString(),
        }
        setMessages(prev => [...prev, optimistic])
        setInputText('')
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 60)
        try {
            await axios.post('/api/messages', { conversationId: activeConvId, message: optimistic.content })
            fetchMessages(activeConvId)
            fetchConversations()
        } catch {
            toast.error('Failed to send message')
            setMessages(prev => prev.filter(m => m.message_id !== optimistic.message_id))
        } finally {
            setSending(false)
            inputRef.current?.focus()
        }
    }

    // ── Start new conversation ────────────────────────────────────────────
    const handleStartChat = async (targetUser) => {
        try {
            const res = await axios.post('/api/messages', {
                receiverId: targetUser.user_id,
                message: `Hi ${targetUser.name}, starting a new thread.`
            })
            if (res.data.success) {
                setShowDirectory(false)
                await fetchConversations()
                // Find the conversation by refreshing
                const convRes = await axios.get('/api/messages')
                if (convRes.data.success && convRes.data.data.length > 0) {
                    setActiveConvId(convRes.data.data[0].conversation_id)
                }
            }
        } catch {
            toast.error('Failed to start conversation')
        }
    }

    const activeConv = conversations.find(c => c.conversation_id === activeConvId)

    const filteredConvs = conversations.filter(c =>
        (c.title || '').toLowerCase().includes(convSearch.toLowerCase())
    )

    const filteredStaff = staffList.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const formatTime = (ts) => {
        const d = new Date(ts)
        const now = new Date()
        const diff = now - d
        if (diff < 60000) return 'just now'
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
        if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    return (
        <div className="flex h-[calc(100vh-120px)] gap-0 border border-slate-200 bg-white overflow-hidden">

            {/* ── Sidebar ─────────────────────────────────────────────── */}
            <div className="w-72 shrink-0 border-r border-slate-200 flex flex-col bg-slate-50">

                {/* Sidebar Header */}
                <div className="px-4 py-4 border-b border-slate-200 flex items-center justify-between">
                    <div>
                        <h2 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Internal Mail</h2>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                            {conversations.length} thread{conversations.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowDirectory(v => !v)}
                        className={`p-1.5 border text-[9px] font-bold transition-all ${showDirectory ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-200 text-slate-500 hover:border-slate-700 hover:text-slate-900'}`}
                        title="New Conversation"
                    >
                        {showDirectory ? <RiCloseLine size={14} /> : <RiAddLine size={14} />}
                    </button>
                </div>

                {/* Sidebar Search */}
                <div className="px-3 py-2 border-b border-slate-200">
                    <div className="flex items-center gap-2 bg-white border border-slate-200 px-2 py-1.5">
                        <RiSearchLine size={12} className="text-slate-300 shrink-0" />
                        <input
                            type="text"
                            value={convSearch}
                            onChange={e => setConvSearch(e.target.value)}
                            placeholder="Search threads..."
                            className="flex-1 bg-transparent text-[10px] font-bold text-slate-700 placeholder-slate-300 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Conversation List */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
                        </div>
                    ) : filteredConvs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                            <RiInboxLine size={24} className="text-slate-200 mb-2" />
                            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">No threads yet</p>
                            <button
                                onClick={() => setShowDirectory(true)}
                                className="mt-3 text-[9px] font-bold text-slate-500 uppercase tracking-widest border border-slate-200 px-3 py-1.5 hover:bg-slate-100 transition-all"
                            >
                                Start one
                            </button>
                        </div>
                    ) : filteredConvs.map(conv => {
                        const isActive = conv.conversation_id === activeConvId
                        return (
                            <button
                                key={conv.conversation_id}
                                onClick={() => setActiveConvId(conv.conversation_id)}
                                className={`w-full text-left px-4 py-3 border-b border-slate-100 transition-all flex items-start gap-3 ${isActive ? 'bg-slate-900' : 'bg-transparent hover:bg-white'}`}
                            >
                                {/* Avatar */}
                                <div className={`w-7 h-7 shrink-0 flex items-center justify-center text-[10px] font-bold uppercase border ${isActive ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-slate-200 text-slate-500'}`}>
                                    {(conv.title || 'D').charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-1">
                                        <p className={`text-[10px] font-bold uppercase tracking-tight truncate ${isActive ? 'text-white' : 'text-slate-800'}`}>
                                            {conv.title || 'Direct Message'}
                                        </p>
                                        <span className={`text-[8px] font-bold uppercase tracking-widest shrink-0 ${isActive ? 'text-white/50' : 'text-slate-300'}`}>
                                            {formatTime(conv.updated_at)}
                                        </span>
                                    </div>
                                    <p className={`text-[9px] font-bold uppercase tracking-tight truncate mt-0.5 ${isActive ? 'text-white/50' : 'text-slate-400'}`}>
                                        {conv.last_message || 'No messages yet'}
                                    </p>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* ── Main Panel ──────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0">

                {showDirectory ? (
                    /* ── Staff Directory ── */
                    <div className="flex flex-col h-full">
                        <div className="px-6 py-4 border-b border-slate-200 bg-white shrink-0">
                            <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">New Conversation</h3>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Select a staff member to begin.</p>
                        </div>

                        {/* Directory Search */}
                        <div className="px-6 py-3 border-b border-slate-100 bg-white shrink-0">
                            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2">
                                <RiSearchLine size={12} className="text-slate-400 shrink-0" />
                                <input
                                    autoFocus
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Search by name or role..."
                                    className="flex-1 bg-transparent text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4">
                            {staffLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-700 rounded-full animate-spin" />
                                </div>
                            ) : filteredStaff.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No staff found</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {filteredStaff.map(user => (
                                        <button
                                            key={user.user_id}
                                            onClick={() => handleStartChat(user)}
                                            className="text-left bg-white border border-slate-200 p-4 hover:border-slate-800 transition-all group"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-9 h-9 bg-slate-100 border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-500 uppercase group-hover:bg-slate-900 group-hover:text-white transition-all shrink-0">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[10px] font-bold text-slate-900 uppercase tracking-tight truncate group-hover:text-slate-700">
                                                        {user.name}
                                                    </p>
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest truncate">{user.email}</p>
                                                    <span className={`inline-block mt-1.5 px-1.5 py-0.5 border text-[8px] font-bold uppercase tracking-widest ${ROLE_COLORS[user.role] || 'text-slate-500 bg-slate-50 border-slate-200'}`}>
                                                        {user.role}
                                                    </span>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                ) : activeConvId ? (
                    /* ── Active Conversation ── */
                    <div className="flex flex-col h-full">

                        {/* Chat Header */}
                        <div className="px-6 py-4 border-b border-slate-200 bg-white shrink-0 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-slate-100 border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-600 uppercase">
                                    {(activeConv?.title || 'D').charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-tight">
                                        {activeConv?.title || 'Direct Message'}
                                    </h3>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                        {messages.length} message{messages.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active</span>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-slate-50/30">
                            {msgLoading && messages.length === 0 ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-700 rounded-full animate-spin" />
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <div className="w-12 h-12 border border-slate-200 bg-white flex items-center justify-center mb-3">
                                        <RiChat3Line size={20} className="text-slate-300" />
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No messages yet</p>
                                    <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest mt-1">Send the first message below.</p>
                                </div>
                            ) : messages.map(msg => {
                                const isMe = String(msg.sender_id) === String(userData?.user_id)
                                const isOptimistic = String(msg.message_id).startsWith('opt-')
                                return (
                                    <div key={msg.message_id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-1 px-1 flex items-center gap-1">
                                            {!isMe && <><RiUserLine size={9} /> {msg.sender_name} · </>}
                                            {formatTime(msg.created_at)}
                                            {isMe && !isOptimistic && <RiCheckDoubleLine size={10} className="ml-1 text-slate-300" />}
                                        </span>
                                        <div className={`px-4 py-2.5 border text-xs font-bold max-w-[70%] leading-relaxed transition-opacity ${isOptimistic ? 'opacity-60' : 'opacity-100'} ${isMe ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-700'}`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="px-6 py-4 border-t border-slate-200 bg-white shrink-0">
                            <form onSubmit={handleSend} className="flex items-center gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputText}
                                    onChange={e => setInputText(e.target.value)}
                                    placeholder="Type a message and press Enter..."
                                    className="flex-1 bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-500 transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputText.trim() || sending}
                                    className="p-2.5 bg-slate-900 text-white hover:bg-slate-700 transition-all disabled:opacity-40 shrink-0"
                                >
                                    <RiSendPlaneFill size={16} />
                                </button>
                            </form>
                        </div>
                    </div>

                ) : (
                    /* ── Empty State ── */
                    <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 text-center p-12">
                        <div className="w-14 h-14 border border-slate-200 bg-white flex items-center justify-center mb-5">
                            <RiInboxLine size={24} className="text-slate-300" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-1">No Thread Selected</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest max-w-xs leading-relaxed">
                            Pick a conversation from the sidebar or start a new one with a team member.
                        </p>
                        <button
                            onClick={() => setShowDirectory(true)}
                            className="mt-5 px-4 py-2 bg-slate-900 text-white text-[9px] font-bold uppercase tracking-widest hover:bg-slate-700 transition-all flex items-center gap-2"
                        >
                            <RiAddLine size={12} /> New Conversation
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default InternalMail
